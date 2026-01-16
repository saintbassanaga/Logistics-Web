import { Component, inject, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {ActorType, KeycloakService, TenantContextService} from '../../core';
import {NgTemplateOutlet} from '@angular/common';


interface DashboardCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  route?: string;
}

/**
 * Dashboard component
 * Displays role-appropriate dashboard content
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="header-content">
          <h1 class="dashboard-title">
            @switch (keycloak.actorType()) {
              @case (ActorType.PLATFORM_ADMIN) {
                Platform Overview
              }
              @case (ActorType.AGENCY_EMPLOYEE) {
                Agency Dashboard
              }
              @case (ActorType.CUSTOMER) {
                My Dashboard
              }
              @default {
                Dashboard
              }
            }
          </h1>
          <p class="dashboard-subtitle">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        @if (keycloak.isAgencyEmployee()) {
          <div class="tenant-badge">
            <span class="badge-icon">🏢</span>
            <span class="badge-text">Agency Context Active</span>
          </div>
        }
      </header>

      <div class="dashboard-grid">
        @for (card of dashboardCards(); track card.title) {
          <article class="dashboard-card" [class.clickable]="card.route">
            @if (card.route) {
              <a [routerLink]="card.route" class="card-link">
                <ng-container *ngTemplateOutlet="cardContent; context: { card }" />
              </a>
            } @else {
              <ng-container *ngTemplateOutlet="cardContent; context: { card }" />
            }
          </article>
        }
      </div>

      <ng-template #cardContent let-card="card">
        <div class="card-header">
          <span class="card-icon">{{ card.icon }}</span>
          <h3 class="card-title">{{ card.title }}</h3>
        </div>
        <div class="card-body">
          <span class="card-value">{{ card.value }}</span>
          @if (card.change) {
            <span
              class="card-change"
              [class.up]="card.trend === 'up'"
              [class.down]="card.trend === 'down'"
            >
              @if (card.trend === 'up') { ↑ }
              @else if (card.trend === 'down') { ↓ }
              {{ card.change }}
            </span>
          }
        </div>
      </ng-template>

      <section class="dashboard-section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="quick-actions">
          @if (keycloak.isAgencyEmployee()) {
            @if (keycloak.hasRole('SHIPMENT_MANAGER')) {
              <a routerLink="/shipments/create" class="action-button primary">
                <span class="action-icon">➕</span>
                <span class="action-label">New Shipment</span>
              </a>
            }
            <a routerLink="/parcels" class="action-button">
              <span class="action-icon">📦</span>
              <span class="action-label">View Parcels</span>
            </a>
            <a routerLink="/shipments" class="action-button">
              <span class="action-icon">🚚</span>
              <span class="action-label">View Shipments</span>
            </a>
          }

          @if (keycloak.isCustomer()) {
            <a routerLink="/my-shipments" class="action-button primary">
              <span class="action-icon">📋</span>
              <span class="action-label">My Shipments</span>
            </a>
            <a routerLink="/track" class="action-button">
              <span class="action-icon">🔍</span>
              <span class="action-label">Track Parcel</span>
            </a>
          }

          @if (keycloak.isPlatformAdmin()) {
            <a routerLink="/admin/agencies" class="action-button primary">
              <span class="action-icon">🏢</span>
              <span class="action-label">Manage Agencies</span>
            </a>
            <a routerLink="/admin/users" class="action-button">
              <span class="action-icon">👥</span>
              <span class="action-label">Manage Users</span>
            </a>
          }
        </div>
      </section>
    </div>
  `,
  styles: `
    .dashboard {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 2rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .dashboard-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0;
    }

    .dashboard-subtitle {
      color: #64748b;
      margin: 0.5rem 0 0;
    }

    .tenant-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .dashboard-card {
      background: #fff;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid #f1f5f9;
    }

    .dashboard-card.clickable:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .card-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .card-icon {
      font-size: 1.5rem;
    }

    .card-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      margin: 0;
    }

    .card-body {
      display: flex;
      align-items: baseline;
      gap: 1rem;
    }

    .card-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a2e;
    }

    .card-change {
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      background: #f1f5f9;
      color: #64748b;
    }

    .card-change.up {
      background: #dcfce7;
      color: #16a34a;
    }

    .card-change.down {
      background: #fee2e2;
      color: #dc2626;
    }

    .dashboard-section {
      background: #fff;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #f1f5f9;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0 0 1.5rem;
    }

    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      color: #1a1a2e;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .action-button:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .action-button.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: #fff;
    }

    .action-button.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .action-icon {
      font-size: 1.25rem;
    }

    @media (max-width: 640px) {
      .dashboard {
        padding: 1rem;
      }

      .dashboard-title {
        font-size: 1.5rem;
      }

      .card-value {
        font-size: 1.5rem;
      }
    }
  `,
})
export class DashboardComponent implements OnInit {
  protected readonly keycloak = inject(KeycloakService);
  protected readonly tenant = inject(TenantContextService);

  protected readonly ActorType = ActorType;

  protected readonly dashboardCards = signal<DashboardCard[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const actorType = this.keycloak.actorType();

    switch (actorType) {
      case ActorType.AGENCY_EMPLOYEE:
        this.dashboardCards.set([
          {
            title: 'Active Shipments',
            value: 47,
            change: '+12%',
            trend: 'up',
            icon: '🚚',
            route: '/shipments',
          },
          {
            title: 'Pending Parcels',
            value: 128,
            change: '-5%',
            trend: 'down',
            icon: '📦',
            route: '/parcels',
          },
          {
            title: 'Delivered Today',
            value: 34,
            change: '+8%',
            trend: 'up',
            icon: '✅',
          },
          {
            title: 'Locations',
            value: 12,
            icon: '📍',
            route: '/agency/locations',
          },
        ]);
        break;

      case ActorType.CUSTOMER:
        this.dashboardCards.set([
          {
            title: 'My Shipments',
            value: 5,
            icon: '📋',
            route: '/my-shipments',
          },
          {
            title: 'In Transit',
            value: 2,
            icon: '🚚',
          },
          {
            title: 'Delivered',
            value: 3,
            icon: '✅',
          },
        ]);
        break;

      case ActorType.PLATFORM_ADMIN:
        this.dashboardCards.set([
          {
            title: 'Total Agencies',
            value: 24,
            change: '+3',
            trend: 'up',
            icon: '🏢',
            route: '/admin/agencies',
          },
          {
            title: 'Active Users',
            value: 1247,
            change: '+15%',
            trend: 'up',
            icon: '👥',
            route: '/admin/users',
          },
          {
            title: 'Total Shipments',
            value: '12.4K',
            change: '+22%',
            trend: 'up',
            icon: '🚚',
          },
          {
            title: 'Platform Health',
            value: '99.9%',
            icon: '💚',
          },
        ]);
        break;
    }
  }
}
