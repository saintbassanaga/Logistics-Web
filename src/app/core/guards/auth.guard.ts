import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { KeycloakService } from '../auth/keycloak.service';
import { ActorType } from '../models/auth.model';
import {firstValueFrom, isObservable} from 'rxjs';

/**
 * Guard that requires user to be authenticated
 * Redirects to login if not authenticated
 */
export const authGuard: CanActivateFn = async () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  console.log('AuthGuard: Running, isInitialized =', keycloakService.isInitialized());
  console.log('AuthGuard: Current URL =', window.location.href);

  // Always wait for initialization to complete (init() is idempotent)
  await keycloakService.init();

  console.log('AuthGuard: After init, isAuthenticated =', keycloakService.isAuthenticated());

  if (keycloakService.isAuthenticated()) {
    console.log('AuthGuard: User is authenticated, allowing access');
    return true;
  }

  // Store the intended destination and redirect to login
  // Use origin + pathname to avoid passing stale query params
  const redirectUri = window.location.origin + window.location.pathname;
  console.log('AuthGuard: Not authenticated, redirecting to login with redirectUri =', redirectUri);
  await keycloakService.login(redirectUri);
  return false;
};

/**
 * Guard that requires specific roles
 * Usage: canActivate: [roleGuard], data: { roles: ['SHIPMENT_MANAGER'] }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (!keycloakService.isAuthenticated()) {
    router.navigate(['/unauthorized']);
    return false;
  }

  const hasRequiredRole = keycloakService.hasAnyRole(requiredRoles);

  if (!hasRequiredRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};

/**
 * Guard that requires specific actor type
 * Usage: canActivate: [actorTypeGuard], data: { actorType: ActorType.AGENCY_EMPLOYEE }
 */
export const actorTypeGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  const requiredActorType = route.data['actorType'] as ActorType | undefined;

  if (!requiredActorType) {
    return true;
  }

  if (!keycloakService.isAuthenticated()) {
    router.navigate(['/unauthorized']);
    return false;
  }

  const currentActorType = keycloakService.actorType();

  if (currentActorType !== requiredActorType) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};

/**
 * Guard for agency employees only
 */
export const agencyEmployeeGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (!keycloakService.isAuthenticated()) {
    router.navigate(['/unauthorized']);
    return false;
  }

  if (!keycloakService.isAgencyEmployee()) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};

/**
 * Guard for platform admins only
 */
export const platformAdminGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (!keycloakService.isAuthenticated()) {
    router.navigate(['/unauthorized']);
    return false;
  }

  if (!keycloakService.isPlatformAdmin()) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};

/**
 * Guard for customers only
 */
export const customerGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (!keycloakService.isAuthenticated()) {
    router.navigate(['/unauthorized']);
    return false;
  }

  if (!keycloakService.isCustomer()) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};

/**
 * Guard that requires user to be NOT authenticated (for login/register pages)
 */
export const noAuthGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (keycloakService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

/**
 * Composite guard factory for combining multiple guards
 * Usage: canActivate: [composeGuards(authGuard, roleGuard)]
 */
export function composeGuards(...guards: CanActivateFn[]): CanActivateFn {
  return async (route, state) => {
    for (const guard of guards) {
      let result = guard(route, state);

      if (isObservable(result)) {
        result = await firstValueFrom(result);
      } else {
        result = await result;
      }

      if (result === false || typeof result === 'object') {
        return result;
      }
    }
    return true;
  };
}

