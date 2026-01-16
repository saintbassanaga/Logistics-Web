import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import {KeycloakService, TenantContextService} from '../../core';


interface Shipment {
  id: string;
  reference: string;
  status: 'OPEN' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED';
  parcelCount: number;
  createdAt: string;
  destination: string;
}

/**
 * Shipment list component
 * Displays shipments for the current agency tenant
 */
@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Shipments</h1>
          <p class="page-subtitle">Manage and track your shipments</p>
        </div>
        @if (keycloak.hasRole('SHIPMENT_MANAGER')) {
          <a routerLink="create" class="btn btn-primary">
            <span>➕</span> New Shipment
          </a>
        }
      </header>

      <div class="filters">
        <input
          type="search"
          class="search-input"
          placeholder="Search shipments..."
          (input)="onSearch($event)"
        />
        <select class="filter-select" (change)="onStatusFilter($event)">
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      <div class="shipments-list">
        @for (shipment of shipments(); track shipment.id) {
          <article class="shipment-card">
            <div class="shipment-header">
              <span class="shipment-ref">{{ shipment.reference }}</span>
              <span class="status-badge" [attr.data-status]="shipment.status">
                {{ shipment.status }}
              </span>
            </div>
            <div class="shipment-body">
              <div class="shipment-detail">
                <span class="detail-icon">📦</span>
                <span>{{ shipment.parcelCount }} parcels</span>
              </div>
              <div class="shipment-detail">
                <span class="detail-icon">📍</span>
                <span>{{ shipment.destination }}</span>
              </div>
              <div class="shipment-detail">
                <span class="detail-icon">📅</span>
                <span>{{ shipment.createdAt }}</span>
              </div>
            </div>
            <div class="shipment-actions">
              <a [routerLink]="[shipment.id]" class="action-link">
                View Details →
              </a>
            </div>
          </article>
        } @empty {
          <div class="empty-state">
            <span class="empty-icon">📭</span>
            <h3>No shipments found</h3>
            <p>Create your first shipment to get started.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .page-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: #1a1a2e;
    }

    .page-subtitle {
      color: #64748b;
      margin: 0.25rem 0 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      font-size: 1rem;
      background: #fff;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .filter-select {
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      font-size: 1rem;
      background: #fff;
      cursor: pointer;
    }

    .shipments-list {
      display: grid;
      gap: 1rem;
    }

    .shipment-card {
      background: #fff;
      border: 1px solid #f1f5f9;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }

    .shipment-card:hover {
      border-color: #e2e8f0;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    }

    .shipment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .shipment-ref {
      font-weight: 600;
      font-size: 1.125rem;
      color: #1a1a2e;
    }

    .status-badge {
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge[data-status="OPEN"] {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .status-badge[data-status="CONFIRMED"] {
      background: #fef3c7;
      color: #b45309;
    }

    .status-badge[data-status="IN_TRANSIT"] {
      background: #e0e7ff;
      color: #4338ca;
    }

    .status-badge[data-status="DELIVERED"] {
      background: #dcfce7;
      color: #16a34a;
    }

    .shipment-body {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .shipment-detail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      font-size: 0.875rem;
    }

    .shipment-actions {
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
    }

    .action-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }

    .action-link:hover {
      color: #764ba2;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: #f8fafc;
      border-radius: 16px;
    }

    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem;
      color: #1a1a2e;
    }

    .empty-state p {
      margin: 0;
      color: #64748b;
    }
  `,
})
export class ShipmentListComponent implements OnInit {
  protected readonly keycloak = inject(KeycloakService);
  protected readonly tenant = inject(TenantContextService);

  protected readonly shipments = signal<Shipment[]>([]);

  ngOnInit(): void {
    // Load mock data - replace with actual API call
    this.shipments.set([
      {
        id: '1',
        reference: 'SHP-2024-001',
        status: 'IN_TRANSIT',
        parcelCount: 5,
        createdAt: '2024-01-15',
        destination: 'Paris Branch',
      },
      {
        id: '2',
        reference: 'SHP-2024-002',
        status: 'OPEN',
        parcelCount: 3,
        createdAt: '2024-01-15',
        destination: 'Lyon Warehouse',
      },
      {
        id: '3',
        reference: 'SHP-2024-003',
        status: 'DELIVERED',
        parcelCount: 8,
        createdAt: '2024-01-14',
        destination: 'Marseille HQ',
      },
    ]);
  }

  protected onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    console.log('Search:', query);
    // Implement search logic
  }

  protected onStatusFilter(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    console.log('Filter by status:', status);
    // Implement filter logic
  }
}
