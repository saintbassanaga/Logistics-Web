import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {ActorType, KeycloakService} from '../../../core';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles?: string[];
  actorTypes?: ActorType[];
}

/**
 * Navigation bar component
 *
 * Features:
 * - Role-based navigation visibility
 * - Actor type-based navigation
 * - User dropdown menu
 * - Responsive design
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Brand -->
        <a routerLink="/dashboard" class="navbar-brand">
          <span class="brand-icon">📦</span>
          <span class="brand-text">Logistics</span>
        </a>

        <!-- Navigation Links -->
        <div class="navbar-nav" [class.open]="mobileMenuOpen()">
          @for (item of visibleNavItems(); track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              class="nav-link"
              (click)="closeMobileMenu()"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          }
        </div>

        <!-- User Menu -->
        <div class="navbar-user">
          <button
            class="user-button"
            (click)="toggleUserMenu()"
            [attr.aria-expanded]="userMenuOpen()"
          >
            <span class="user-avatar">
              {{ userInitials() }}
            </span>
            <span class="user-info">
              <span class="user-type">{{ actorTypeLabel() }}</span>
              @if (keycloak.agencyId()) {
                <span class="user-agency">Agency</span>
              }
            </span>
            <span class="dropdown-arrow" [class.open]="userMenuOpen()">▼</span>
          </button>

          @if (userMenuOpen()) {
            <div class="user-dropdown">
              <a routerLink="/profile" class="dropdown-item" (click)="closeUserMenu()">
                <span>👤</span> Profile
              </a>
              <hr class="dropdown-divider" />
              <button class="dropdown-item logout" (click)="logout()">
                <span>🚪</span> Logout
              </button>
            </div>
          }
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          class="mobile-toggle"
          (click)="toggleMobileMenu()"
          [attr.aria-expanded]="mobileMenuOpen()"
          aria-label="Toggle navigation"
        >
          <span class="hamburger" [class.open]="mobileMenuOpen()"></span>
        </button>
      </div>
    </nav>

    <!-- Backdrop for dropdowns -->
    @if (userMenuOpen() || mobileMenuOpen()) {
      <div class="backdrop" (click)="closeAllMenus()"></div>
    }
  `,
  styles: `
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--navbar-height, 64px);
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000;
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: #fff;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .brand-icon {
      font-size: 1.5rem;
    }

    .brand-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .nav-link:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-link.active {
      color: #fff;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .nav-icon {
      font-size: 1.1rem;
    }

    .navbar-user {
      position: relative;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .user-button:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.125rem;
    }

    .user-type {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .user-agency {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .dropdown-arrow {
      font-size: 0.625rem;
      transition: transform 0.2s ease;
    }

    .dropdown-arrow.open {
      transform: rotate(180deg);
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      min-width: 180px;
      background: #1a1a2e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0.5rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      z-index: 1001;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .dropdown-item.logout:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .dropdown-divider {
      margin: 0.5rem 0;
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mobile-toggle {
      display: none;
      padding: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
    }

    .hamburger {
      display: block;
      width: 24px;
      height: 2px;
      background: #fff;
      position: relative;
      transition: all 0.3s ease;
    }

    .hamburger::before,
    .hamburger::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background: #fff;
      transition: all 0.3s ease;
    }

    .hamburger::before {
      top: -8px;
    }

    .hamburger::after {
      top: 8px;
    }

    .hamburger.open {
      background: transparent;
    }

    .hamburger.open::before {
      top: 0;
      transform: rotate(45deg);
    }

    .hamburger.open::after {
      top: 0;
      transform: rotate(-45deg);
    }

    .backdrop {
      position: fixed;
      inset: 0;
      background: transparent;
      z-index: 999;
    }

    @media (max-width: 768px) {
      .navbar-nav {
        position: fixed;
        top: var(--navbar-height, 64px);
        left: 0;
        right: 0;
        flex-direction: column;
        background: #1a1a2e;
        padding: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        transform: translateY(-100%);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
      }

      .navbar-nav.open {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
      }

      .nav-link {
        width: 100%;
        padding: 1rem;
      }

      .mobile-toggle {
        display: block;
      }

      .user-info {
        display: none;
      }

      .dropdown-arrow {
        display: none;
      }
    }
  `,
})
export class NavbarComponent {
  protected readonly keycloak = inject(KeycloakService);

  protected readonly mobileMenuOpen = signal(false);
  protected readonly userMenuOpen = signal(false);

  private readonly allNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: '📊',
    },
    {
      label: 'Shipments',
      route: '/shipments',
      icon: '🚚',
      actorTypes: [ActorType.AGENCY_EMPLOYEE],
    },
    {
      label: 'Parcels',
      route: '/parcels',
      icon: '📦',
      actorTypes: [ActorType.AGENCY_EMPLOYEE],
    },
    {
      label: 'Agency',
      route: '/agency',
      icon: '🏢',
      actorTypes: [ActorType.AGENCY_EMPLOYEE],
      roles: ['AGENCY_ADMIN', 'AGENCY_MANAGER'],
    },
    {
      label: 'My Shipments',
      route: '/my-shipments',
      icon: '📋',
      actorTypes: [ActorType.CUSTOMER],
    },
    {
      label: 'Admin',
      route: '/admin',
      icon: '⚙️',
      actorTypes: [ActorType.PLATFORM_ADMIN],
    },
  ];

  protected visibleNavItems = () => {
    const actorType = this.keycloak.actorType();
    const userRoles = this.keycloak.roles();

    return this.allNavItems.filter((item) => {
      // Check actor type
      if (item.actorTypes && actorType) {
        if (!item.actorTypes.includes(actorType)) {
          return false;
        }
      }

      // Check roles
      if (item.roles && item.roles.length > 0) {
        const hasRole = item.roles.some((role) => userRoles.has(role));
        if (!hasRole) {
          return false;
        }
      }

      return true;
    });
  };

  protected userInitials = () => {
    const userId = this.keycloak.userId();
    if (!userId) return '?';
    return userId.substring(0, 2).toUpperCase();
  };

  protected actorTypeLabel = () => {
    const actorType = this.keycloak.actorType();
    switch (actorType) {
      case ActorType.AGENCY_EMPLOYEE:
        return 'Employee';
      case ActorType.PLATFORM_ADMIN:
        return 'Admin';
      case ActorType.CUSTOMER:
        return 'Customer';
      default:
        return 'User';
    }
  };

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
    this.userMenuOpen.set(false);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
    this.mobileMenuOpen.set(false);
  }

  protected closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  protected closeAllMenus(): void {
    this.mobileMenuOpen.set(false);
    this.userMenuOpen.set(false);
  }

  protected async logout(): Promise<void> {
    this.closeAllMenus();
    await this.keycloak.logout();
  }
}
