import {
  Injectable,
  signal,
  computed,
  inject,
  DestroyRef,
  PLATFORM_ID,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import Keycloak from 'keycloak-js';
import {
  AuthState,
  AuthenticatedUser,
  AuthError,
  AuthErrorCode,
  ActorType,
  JwtClaims,
  KeycloakInitOptions,
} from '../models/auth.model';
import {environment} from '../../../environments/environment';

/**
 * KeycloakService - Core authentication service for the logistics platform
 *
 * This service wraps keycloak-js directly (avoiding deprecated keycloak-angular)
 * and provides a signal-based reactive API for authentication state.
 *
 * Features:
 * - Signal-based reactive state management
 * - Automatic token refresh
 * - JWT claim extraction (actor_type, agency_id, roles)
 * - Multi-tenancy support via agency_id
 * - PKCE flow for enhanced security
 */
@Injectable({providedIn: 'root'})
export class KeycloakService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private keycloak: Keycloak | null = null;
  private tokenRefreshInterval: ReturnType<typeof setInterval> | null = null;

  /** Internal state signal */
  private readonly _state = signal<AuthState>({
    isAuthenticated: false,
    isInitialized: false,
    isLoading: true,
    user: null,
    error: null,
  });

  /** Public readonly state */
  readonly state = this._state.asReadonly();

  /** Computed signals for convenient access */
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly isInitialized = computed(() => this._state().isInitialized);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly user = computed(() => this._state().user);
  readonly error = computed(() => this._state().error);

  /** Computed user properties */
  readonly userId = computed(() => this._state().user?.id ?? null);
  readonly actorType = computed(() => this._state().user?.actorType ?? null);
  readonly agencyId = computed(() => this._state().user?.agencyId ?? null);
  readonly roles = computed(() => this._state().user?.roles ?? new Set<string>());

  /** Actor type checks */
  readonly isAgencyEmployee = computed(
    () => this._state().user?.actorType === ActorType.AGENCY_EMPLOYEE
  );
  readonly isPlatformAdmin = computed(
    () => this._state().user?.actorType === ActorType.PLATFORM_ADMIN
  );
  readonly isCustomer = computed(
    () => this._state().user?.actorType === ActorType.CUSTOMER
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.cleanup());
  }

  private initPromise: Promise<boolean> | null = null;

  /**
   * Initialize Keycloak authentication
   * Should be called during application bootstrap
   * This method is idempotent - multiple calls return the same promise
   */
  async init(options?: Partial<KeycloakInitOptions>): Promise<boolean> {
    // Return existing initialization promise if already initializing or initialized
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.doInit(options);
    return this.initPromise;
  }

  private async doInit(options?: Partial<KeycloakInitOptions>): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('KeycloakService: Skipping initialization in non-browser environment');
      this.updateState({isInitialized: true, isLoading: false});
      return false;
    }

    // Debug: Log current URL to see if auth code is present
    console.log('KeycloakService: Current URL:', window.location.href);
    console.log('KeycloakService: URL has code param:', window.location.search.includes('code='));

    const initOptions: KeycloakInitOptions = {
      onLoad: 'check-sso',
      checkLoginIframe: false,
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      ...options,
    };

    try {
      this.keycloak = new Keycloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      });

      this.setupKeycloakCallbacks();

      console.log('KeycloakService: Initializing with options', initOptions);

      const authenticated = await this.keycloak.init({
        onLoad: initOptions.onLoad,
        checkLoginIframe: initOptions.checkLoginIframe,
        pkceMethod: initOptions.pkceMethod,
        silentCheckSsoRedirectUri: initOptions.silentCheckSsoRedirectUri,
        enableLogging: initOptions.enableLogging ?? !environment.production,
      });

      console.log('KeycloakService: Init complete, authenticated =', authenticated);
      console.log('KeycloakService: Keycloak.authenticated =', this.keycloak.authenticated);
      console.log('KeycloakService: Token present =', !!this.keycloak.token);

      if (authenticated) {
        this.handleAuthenticationSuccess();
        this.startTokenRefresh();
        console.log('KeycloakService: User authenticated, token expires at', this.keycloak.tokenParsed?.exp);
      } else {
        console.log('KeycloakService: Not authenticated. Token:', this.keycloak.token);
        console.log('KeycloakService: Auth error:', this.keycloak.authServerUrl);
      }

      this.updateState({
        isAuthenticated: authenticated,
        isInitialized: true,
        isLoading: false,
      });

      return authenticated;
    } catch (error) {
      const authError = this.createAuthError(
        AuthErrorCode.INITIALIZATION_FAILED,
        'Failed to initialize Keycloak',
        error
      );
      this.updateState({
        isInitialized: true,
        isLoading: false,
        error: authError,
      });
      console.error('KeycloakService: Initialization failed', error);
      return false;
    }
  }

  /**
   * Redirect to Keycloak login page
   */
  async login(redirectUri?: string): Promise<void> {
    if (!this.keycloak) {
      throw new Error('KeycloakService: Not initialized');
    }

    this.updateState({isLoading: true});

    try {
      await this.keycloak.login({
        redirectUri: redirectUri ?? window.location.origin,
      });
    } catch (error) {
      const authError = this.createAuthError(
        AuthErrorCode.LOGIN_FAILED,
        'Login failed',
        error
      );
      this.updateState({isLoading: false, error: authError});
      throw authError;
    }
  }

  /**
   * Logout and redirect to Keycloak logout page
   */
  async logout(redirectUri?: string): Promise<void> {
    if (!this.keycloak) {
      throw new Error('KeycloakService: Not initialized');
    }

    this.cleanup();
    await this.keycloak.logout({
      redirectUri: redirectUri ?? window.location.origin,
    });
  }

  /**
   * Get the current access token
   * Automatically refreshes if close to expiry
   */
  async getToken(): Promise<string | null> {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return null;
    }

    try {
      // Refresh token if it expires within the threshold
      const refreshed = await this.keycloak.updateToken(
        environment.tokenRefreshThreshold
      );

      if (refreshed) {
        this.handleAuthenticationSuccess();
      }

      return this.keycloak.token ?? null;
    } catch (error) {
      console.error('KeycloakService: Token refresh failed', error);
      this.handleTokenRefreshFailure();
      return null;
    }
  }

  /**
   * Get the current refresh token
   */
  getRefreshToken(): string | null {
    return this.keycloak?.refreshToken ?? null;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const currentUser = this._state().user;
    return currentUser?.roles.has(role) ?? false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const currentUser = this._state().user;
    if (!currentUser) return false;
    return roles.some((role) => currentUser.roles.has(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    const currentUser = this._state().user;
    if (!currentUser) return false;
    return roles.every((role) => currentUser.roles.has(role));
  }

  /**
   * Check if user belongs to a specific agency
   */
  belongsToAgency(agencyId: string): boolean {
    const currentUser = this._state().user;
    return (
      currentUser?.actorType === ActorType.AGENCY_EMPLOYEE &&
      currentUser?.agencyId === agencyId
    );
  }

  /**
   * Force token refresh
   */
  async refreshToken(): Promise<boolean> {
    if (!this.keycloak) {
      return false;
    }

    try {
      const refreshed = await this.keycloak.updateToken(-1); // Force refresh
      if (refreshed) {
        this.handleAuthenticationSuccess();
      }
      return true;
    } catch (error) {
      console.error('KeycloakService: Force token refresh failed', error);
      this.handleTokenRefreshFailure();
      return false;
    }
  }

  /**
   * Get raw token claims for advanced use cases
   */
  getTokenClaims(): JwtClaims | null {
    if (!this.keycloak?.tokenParsed) {
      return null;
    }
    return this.keycloak.tokenParsed as JwtClaims;
  }

  // ============ Private Methods ============

  private setupKeycloakCallbacks(): void {
    if (!this.keycloak) return;

    this.keycloak.onAuthSuccess = () => {
      this.handleAuthenticationSuccess();
    };

    this.keycloak.onAuthError = (error) => {
      console.error('KeycloakService: Auth error', error);
      this.updateState({
        isAuthenticated: false,
        user: null,
        error: this.createAuthError(
          AuthErrorCode.LOGIN_FAILED,
          'Authentication error',
          error
        ),
      });
    };

    this.keycloak.onAuthRefreshSuccess = () => {
      this.handleAuthenticationSuccess();
    };

    this.keycloak.onAuthRefreshError = () => {
      this.handleTokenRefreshFailure();
    };

    this.keycloak.onTokenExpired = () => {
      console.warn('KeycloakService: Token expired, attempting refresh');
      this.refreshToken();
    };

    this.keycloak.onAuthLogout = () => {
      this.updateState({
        isAuthenticated: false,
        user: null,
        error: null,
      });
    };
  }

  private handleAuthenticationSuccess(): void {
    if (!this.keycloak?.tokenParsed) return;

    const claims = this.keycloak.tokenParsed as JwtClaims;
    const user = this.extractUserFromClaims(claims);

    this.updateState({
      isAuthenticated: true,
      user,
      error: null,
    });
  }

  private handleTokenRefreshFailure(): void {
    this.stopTokenRefresh();
    this.updateState({
      isAuthenticated: false,
      user: null,
      error: this.createAuthError(
        AuthErrorCode.TOKEN_REFRESH_FAILED,
        'Token refresh failed. Please login again.'
      ),
    });
  }

  private extractUserFromClaims(claims: JwtClaims): AuthenticatedUser {
    return {
      id: claims.sub,
      actorType: claims.actor_type ?? ActorType.CUSTOMER,
      agencyId: claims.agency_id ?? null,
      roles: new Set(claims.roles ?? []),
      tokenExpiry: new Date(claims.exp * 1000),
    };
  }

  private startTokenRefresh(): void {
    this.stopTokenRefresh();

    // Check token every 30 seconds
    this.tokenRefreshInterval = setInterval(async () => {
      if (this.keycloak?.authenticated) {
        try {
          await this.keycloak.updateToken(environment.tokenRefreshThreshold);
        } catch {
          console.warn('KeycloakService: Periodic token refresh failed');
        }
      }
    }, 30_000);
  }

  private stopTokenRefresh(): void {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
    }
  }

  private updateState(partialState: Partial<AuthState>): void {
    this._state.update((current) => ({...current, ...partialState}));
  }

  private createAuthError(
    code: AuthErrorCode,
    message: string,
    details?: unknown
  ): AuthError {
    return {code, message, details};
  }

  private cleanup(): void {
    this.stopTokenRefresh();
  }
}
