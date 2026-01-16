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
    <div class="p-6 max-w-[1600px] mx-auto space-y-6">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-slate-800">
            @switch (keycloak.actorType()) {
              @case (ActorType.PLATFORM_ADMIN) { Platform Analytics }
              @case (ActorType.AGENCY_EMPLOYEE) { Agency Analytics }
              @case (ActorType.CUSTOMER) { My Overview }
              @default { Dashboard }
            }
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Operational metrics & performance overview
          </p>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <!-- Website Analytics (BIG CARD) -->
        <div class="xl:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white p-6 relative overflow-hidden">

          <div class="relative z-10">
            <h2 class="text-lg font-semibold">Website Analytics</h2>
            <p class="text-sm opacity-80">Total 28.5% Conversion Rate</p>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <p class="text-sm opacity-80">Sessions</p>
                <p class="text-xl font-bold">1.5k</p>
              </div>
              <div>
                <p class="text-sm opacity-80">Page Views</p>
                <p class="text-xl font-bold">3.1k</p>
              </div>
              <div>
                <p class="text-sm opacity-80">Leads</p>
                <p class="text-xl font-bold">1.2k</p>
              </div>
              <div>
                <p class="text-sm opacity-80">Conversions</p>
                <p class="text-xl font-bold">12%</p>
              </div>
            </div>
          </div>

          <!-- Decorative -->
          <div class="absolute right-6 top-6 text-[160px] opacity-10">📦</div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">

          <!-- Average Daily Sales -->
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-500">Average Daily Sales</p>
            <p class="text-2xl font-semibold mt-2">$28,450</p>
            <p class="text-sm text-green-600 mt-1">+18.2%</p>
            <div class="mt-4 h-16 bg-slate-100 rounded"></div>
          </div>

          <!-- Sales Overview -->
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-500">Sales Overview</p>
            <p class="text-2xl font-semibold mt-2">$42.5k</p>

            <div class="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p class="text-slate-500">Orders</p>
                <p class="font-semibold">6,440</p>
              </div>
              <div>
                <p class="text-slate-500">Visits</p>
                <p class="font-semibold">12,749</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Bottom Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <!-- Earning Reports -->
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold">Earning Reports</h3>
              <p class="text-sm text-slate-500">Weekly earnings overview</p>
            </div>
            <span class="text-green-600 text-sm font-medium">+4.2%</span>
          </div>

          <p class="text-3xl font-bold mt-4">$468</p>

          <div class="grid grid-cols-3 gap-4 mt-6 text-sm">
            <div>
              <p class="text-slate-500">Earnings</p>
              <p class="font-semibold">$545.69</p>
            </div>
            <div>
              <p class="text-slate-500">Profit</p>
              <p class="font-semibold">$256.34</p>
            </div>
            <div>
              <p class="text-slate-500">Expense</p>
              <p class="font-semibold text-red-600">$74.19</p>
            </div>
          </div>
        </div>

        <!-- Support Tracker -->
        <div class="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <h3 class="font-semibold">Support Tracker</h3>
            <p class="text-sm text-slate-500">Last 7 days</p>
          </div>

          <div class="flex items-center justify-between mt-6">
            <div>
              <p class="text-3xl font-bold">164</p>
              <p class="text-sm text-slate-500">Total Tickets</p>

              <div class="mt-4 space-y-2 text-sm">
                <p>🟢 New: 142</p>
                <p>🟡 Open: 28</p>
                <p>🔵 Response: 1 Day</p>
              </div>
            </div>

            <div class="text-center">
              <div class="w-28 h-28 rounded-full border-8 border-indigo-500 flex items-center justify-center">
                <span class="font-semibold">85%</span>
              </div>
              <p class="text-sm text-slate-500 mt-2">Completed</p>
            </div>
          </div>
        </div>

      </div>

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
