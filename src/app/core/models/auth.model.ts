/**
 * Core authentication models for the logistics platform
 * These types align with the JWT contract defined in the architecture
 */

/**
 * Actor types as defined in ADR-004
 * Determines the type of user accessing the platform
 */
export enum ActorType {
  CUSTOMER = 'CUSTOMER',
  AGENCY_EMPLOYEE = 'AGENCY_EMPLOYEE',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
}

/**
 * Platform roles aligned with Keycloak realm roles
 * Used for RBAC authorization
 */
export enum PlatformRole {
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  AGENCY_ADMIN = 'AGENCY_ADMIN',
  AGENCY_MANAGER = 'AGENCY_MANAGER',
  SHIPMENT_MANAGER = 'SHIPMENT_MANAGER',
  PARCEL_MANAGER = 'PARCEL_MANAGER',
  DELIVERY_DRIVER = 'DELIVERY_DRIVER',
}

/**
 * JWT claims structure as defined in the Keycloak integration guide
 * These claims are embedded in the access token
 */
export interface JwtClaims {
  /** Token expiration timestamp */
  readonly exp: number;
  /** Token issued at timestamp */
  readonly iat: number;
  /** Token issuer (Keycloak realm URL) */
  readonly iss: string;
  /** Subject - User ID (UUID) */
  readonly sub: string;
  /** Token type */
  readonly typ: string;
  /** Authorized party (client ID) */
  readonly azp: string;
  /** Actor type - determines user category */
  readonly actor_type: ActorType;
  /** Agency ID - only present for AGENCY_EMPLOYEE */
  readonly agency_id?: string;
  /** Assigned roles */
  readonly roles: string[];
}

/**
 * Authenticated user context derived from JWT
 * Used throughout the application for authorization decisions
 */
export interface AuthenticatedUser {
  readonly id: string;
  readonly actorType: ActorType;
  readonly agencyId: string | null;
  readonly roles: ReadonlySet<string>;
  readonly tokenExpiry: Date;
}

/**
 * Authentication state for the application
 */
export interface AuthState {
  readonly isAuthenticated: boolean;
  readonly isInitialized: boolean;
  readonly isLoading: boolean;
  readonly user: AuthenticatedUser | null;
  readonly error: AuthError | null;
}

/**
 * Authentication error types
 */
export enum AuthErrorCode {
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  LOGIN_FAILED = 'LOGIN_FAILED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_REFRESH_FAILED = 'TOKEN_REFRESH_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export interface AuthError {
  readonly code: AuthErrorCode;
  readonly message: string;
  readonly details?: unknown;
}

/**
 * Keycloak initialization options
 */
export interface KeycloakInitOptions {
  readonly onLoad: 'check-sso' | 'login-required';
  readonly checkLoginIframe: boolean;
  readonly pkceMethod: 'S256';
  readonly silentCheckSsoRedirectUri?: string;
  readonly enableLogging?: boolean;
}

/**
 * Type guard to check if user is an agency employee
 */
export function isAgencyEmployee(user: AuthenticatedUser): boolean {
  return user.actorType === ActorType.AGENCY_EMPLOYEE && user.agencyId !== null;
}

/**
 * Type guard to check if user is a platform admin
 */
export function isPlatformAdmin(user: AuthenticatedUser): boolean {
  return user.actorType === ActorType.PLATFORM_ADMIN;
}

/**
 * Type guard to check if user is a customer
 */
export function isCustomer(user: AuthenticatedUser): boolean {
  return user.actorType === ActorType.CUSTOMER;
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: AuthenticatedUser, role: string): boolean {
  return user.roles.has(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: AuthenticatedUser, roles: string[]): boolean {
  return roles.some((role) => user.roles.has(role));
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(user: AuthenticatedUser, roles: string[]): boolean {
  return roles.every((role) => user.roles.has(role));
}

/**
 * Check if user belongs to a specific agency
 */
export function belongsToAgency(user: AuthenticatedUser, agencyId: string): boolean {
  return isAgencyEmployee(user) && user.agencyId === agencyId;
}
