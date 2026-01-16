import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {ActorType, KeycloakService, TenantContextService} from '../../core';


@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            {{ userInitials() }}
          </div>
          <div class="profile-info">
            <h1 class="profile-name">User Profile</h1>
            <span class="profile-type" [attr.data-type]="keycloak.actorType()">
              {{ actorTypeLabel() }}
            </span>
          </div>
        </div>

        <div class="profile-details">
          <div class="detail-row">
            <span class="detail-label">User ID</span>
            <span class="detail-value">{{ keycloak.userId() }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Actor Type</span>
            <span class="detail-value">{{ keycloak.actorType() }}</span>
          </div>

          @if (keycloak.agencyId()) {
            <div class="detail-row">
              <span class="detail-label">Agency ID</span>
              <span class="detail-value">{{ keycloak.agencyId() }}</span>
            </div>
          }

          <div class="detail-row">
            <span class="detail-label">Roles</span>
            <div class="roles-list">
              @for (role of rolesArray(); track role) {
                <span class="role-badge">{{ role }}</span>
              }
              @empty {
                <span class="no-roles">No roles assigned</span>
              }
            </div>
          </div>
        </div>

        <div class="profile-actions">
          <button class="btn btn-secondary" (click)="refreshToken()">
            Refresh Token
          </button>
          <button class="btn btn-danger" (click)="logout()">
            Logout
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .profile-container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .profile-card {
      background: #fff;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
    }

    .profile-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: #1a1a2e;
    }

    .profile-type {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .profile-type[data-type="AGENCY_EMPLOYEE"] {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .profile-type[data-type="PLATFORM_ADMIN"] {
      background: #fef3c7;
      color: #b45309;
    }

    .profile-type[data-type="CUSTOMER"] {
      background: #dcfce7;
      color: #16a34a;
    }

    .profile-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .detail-row {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #64748b;
    }

    .detail-value {
      font-size: 0.875rem;
      color: #1a1a2e;
      word-break: break-all;
    }

    .roles-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      background: #f1f5f9;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      color: #475569;
    }

    .no-roles {
      color: #94a3b8;
      font-style: italic;
    }

    .profile-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #f1f5f9;
    }

    .btn {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-secondary {
      background: #f1f5f9;
      color: #475569;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
    }

    .btn-danger {
      background: #fee2e2;
      color: #dc2626;
    }

    .btn-danger:hover {
      background: #fecaca;
    }
  `,
})
export class ProfileComponent {
  protected readonly keycloak = inject(KeycloakService);
  protected readonly tenant = inject(TenantContextService);

  protected userInitials(): string {
    const userId = this.keycloak.userId();
    if (!userId) return '?';
    return userId.substring(0, 2).toUpperCase();
  }

  protected actorTypeLabel(): string {
    const actorType = this.keycloak.actorType();
    switch (actorType) {
      case ActorType.AGENCY_EMPLOYEE:
        return 'Agency Employee';
      case ActorType.PLATFORM_ADMIN:
        return 'Platform Admin';
      case ActorType.CUSTOMER:
        return 'Customer';
      default:
        return 'Unknown';
    }
  }

  protected rolesArray(): string[] {
    const roles = this.keycloak.roles();
    return Array.from(roles);
  }

  protected async refreshToken(): Promise<void> {
    await this.keycloak.refreshToken();
  }

  protected async logout(): Promise<void> {
    await this.keycloak.logout();
  }
}
