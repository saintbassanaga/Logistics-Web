import { Injectable, computed, inject } from '@angular/core';
import { KeycloakService } from '../auth/keycloak.service';
import { ActorType } from '../models/auth.model';

/**
 * TenantContextService - Provides multi-tenant context throughout the application
 *
 * This service derives tenant information from the authenticated user's JWT
 * and provides computed properties for tenant-aware operations.
 *
 * Per ADR-006: Multi-tenance logique par agency_id
 * - agency_id is mandatory for all business entities
 * - Tenant context is applied at JWT, API, Repository, and Domain levels
 */
@Injectable({ providedIn: 'root' })
export class TenantContextService {
  private readonly keycloakService = inject(KeycloakService);

  /**
   * Current tenant (agency) ID derived from JWT
   * Returns null for customers and platform admins
   */
  readonly currentAgencyId = computed(() => {
    const user = this.keycloakService.user();
    if (!user) return null;

    // Only agency employees have a fixed tenant context
    if (user.actorType === ActorType.AGENCY_EMPLOYEE) {
      return user.agencyId;
    }

    return null;
  });

  /**
   * Whether the current user operates in a tenant context
   */
  readonly hasTenantContext = computed(() => this.currentAgencyId() !== null);

  /**
   * Whether the current user can access multiple agencies
   * Platform admins can access all agencies
   */
  readonly isMultiTenant = computed(
    () => this.keycloakService.isPlatformAdmin()
  );

  /**
   * Get the tenant context for API requests
   * Returns the agency ID that should be used for data filtering
   */
  readonly apiTenantContext = computed(() => {
    const agencyId = this.currentAgencyId();
    if (agencyId) {
      return { agencyId, enforced: true };
    }
    return { agencyId: null, enforced: false };
  });

  /**
   * Validate that a resource belongs to the current tenant
   * Used for ABAC policy enforcement
   *
   * @param resourceAgencyId - The agency ID of the resource being accessed
   * @returns true if access is allowed, false otherwise
   */
  validateTenantAccess(resourceAgencyId: string): boolean {
    const user = this.keycloakService.user();
    if (!user) return false;

    // Platform admins can access any tenant
    if (user.actorType === ActorType.PLATFORM_ADMIN) {
      return true;
    }

    // Agency employees can only access their own agency's resources
    if (user.actorType === ActorType.AGENCY_EMPLOYEE) {
      return user.agencyId === resourceAgencyId;
    }

    // Customers have resource-level access (handled by other policies)
    return false;
  }

  /**
   * Get tenant ID for creating new resources
   * Throws if user doesn't have a tenant context
   */
  getCreateTenantId(): string {
    const agencyId = this.currentAgencyId();
    if (!agencyId) {
      throw new Error(
        'Cannot create tenant-scoped resource: No tenant context available'
      );
    }
    return agencyId;
  }
}
