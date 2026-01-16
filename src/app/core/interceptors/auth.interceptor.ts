import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { KeycloakService } from '../auth/keycloak.service';
import {environment} from '../../../environments/environment';

/**
 * URLs that should not have the Bearer token attached
 */
const EXCLUDED_URLS: string[] = [
  '/assets/',
  environment.keycloak.url,
];

/**
 * Check if URL should be excluded from token injection
 */
function shouldExclude(url: string): boolean {
  return EXCLUDED_URLS.some((excluded) => url.includes(excluded));
}

/**
 * Auth interceptor that adds Bearer token to outgoing requests
 *
 * Features:
 * - Automatic token injection for API requests
 * - Token refresh on 401 errors
 * - URL exclusion for public endpoints
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);

  // Skip token for excluded URLs
  if (shouldExclude(req.url)) {
    return next(req);
  }

  // Skip if not authenticated
  if (!keycloakService.isAuthenticated()) {
    return next(req);
  }

  // Get token and attach to request
  return from(keycloakService.getToken()).pipe(
    switchMap((token) => {
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(authReq);
      }
      return next(req);
    }),
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Attempt token refresh and retry
        return from(keycloakService.refreshToken()).pipe(
          switchMap((success) => {
            if (success) {
              return from(keycloakService.getToken()).pipe(
                switchMap((newToken) => {
                  if (newToken) {
                    const retryReq = req.clone({
                      setHeaders: {
                        Authorization: `Bearer ${newToken}`,
                      },
                    });
                    return next(retryReq);
                  }
                  return throwError(() => error);
                })
              );
            }
            // Token refresh failed, redirect to login
            keycloakService.login();
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

/**
 * Tenant context interceptor that adds X-Tenant-ID header
 * For multi-tenant API requests
 */
export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);

  // Only add tenant header for API requests
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const agencyId = keycloakService.agencyId();

  if (agencyId) {
    const tenantReq = req.clone({
      setHeaders: {
        'X-Tenant-ID': agencyId,
      },
    });
    return next(tenantReq);
  }

  return next(req);
};

/**
 * Error interceptor for global error handling
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Log error for debugging
      if (!environment.production) {
        console.error('HTTP Error:', {
          url: req.url,
          status: error.status,
          message: error.message,
          error: error.error,
        });
      }

      // Transform error for consistent handling
      const transformedError = {
        status: error.status,
        message: getErrorMessage(error),
        url: req.url,
        timestamp: new Date().toISOString(),
      };

      return throwError(() => transformedError);
    })
  );
};

/**
 * Extract user-friendly error message
 */
function getErrorMessage(error: HttpErrorResponse): string {
  if (error.error?.message) {
    return error.error.message;
  }

  switch (error.status) {
    case 0:
      return 'Unable to connect to server. Please check your network connection.';
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please login.';
    case 403:
      return 'Access denied. You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'Conflict. The resource may have been modified.';
    case 422:
      return 'Validation error. Please check your input.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
}

/**
 * Logging interceptor for development debugging
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (environment.production) {
    return next(req);
  }

  const startTime = performance.now();

  return next(req).pipe(
    catchError((error) => {
      const duration = performance.now() - startTime;
      console.log(`[HTTP] ${req.method} ${req.url} - ERROR (${duration.toFixed(0)}ms)`);
      return throwError(() => error);
    })
  );
};
