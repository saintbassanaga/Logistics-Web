import { Routes } from '@angular/router';
import {
  authGuard,
  roleGuard,
  agencyEmployeeGuard,
  platformAdminGuard,
  noAuthGuard,
  composeGuards,
} from './core';
import { ActorType } from './core';

/**
 * Application routes with authentication and authorization guards
 *
 * Route structure:
 * - Public routes: accessible without authentication
 * - Protected routes: require authentication
 * - Role-based routes: require specific roles
 * - Actor-based routes: require specific actor types
 */
export const routes: Routes = [
  // ============ Public Routes ============
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },

  {
    path: 'landing',
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent),
    canActivate: [noAuthGuard],
  },

  // ============ Auth Callback Routes ============
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/errors/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },

  // ============ Protected Routes (Require Authentication) ============
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard],
  },

  // ============ Shipment Routes (Agency Employees) ============
  {
    path: 'shipments',
    canActivate: [composeGuards(authGuard, agencyEmployeeGuard)],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/shipments/shipment-list.component').then(
            (m) => m.ShipmentListComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/shipments/shipment-create.component').then(
            (m) => m.ShipmentCreateComponent
          ),
        canActivate: [roleGuard],
        data: { roles: ['SHIPMENT_MANAGER', 'AGENCY_ADMIN'] },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/shipments/shipment-detail.component').then(
            (m) => m.ShipmentDetailComponent
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./features/shipments/shipment-edit.component').then(
            (m) => m.ShipmentEditComponent
          ),
        canActivate: [roleGuard],
        data: { roles: ['SHIPMENT_MANAGER', 'AGENCY_ADMIN'] },
      },
    ],
  },

  // ============ Parcel Routes (Agency Employees) ============
  {
    path: 'parcels',
    canActivate: [composeGuards(authGuard, agencyEmployeeGuard)],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/parcels/parcel-list.component').then(
            (m) => m.ParcelListComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/parcels/parcel-detail.component').then(
            (m) => m.ParcelDetailComponent
          ),
      },
      {
        path: ':id/track',
        loadComponent: () =>
          import('./features/parcels/parcel-tracking.component').then(
            (m) => m.ParcelTrackingComponent
          ),
      },
    ],
  },

  // ============ Agency Routes (Agency Admins) ============
  {
    path: 'agency',
    canActivate: [composeGuards(authGuard, agencyEmployeeGuard, roleGuard)],
    data: { roles: ['AGENCY_ADMIN', 'AGENCY_MANAGER'] },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/agencies/agency-dashboard.component').then(
            (m) => m.AgencyDashboardComponent
          ),
      },
      {
        path: 'locations',
        loadComponent: () =>
          import('./features/agencies/agency-locations.component').then(
            (m) => m.AgencyLocationsComponent
          ),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/agencies/agency-employees.component').then(
            (m) => m.AgencyEmployeesComponent
          ),
        canActivate: [roleGuard],
        data: { roles: ['AGENCY_ADMIN'] },
      },
    ],
  },

  // ============ Platform Admin Routes ============
  {
    path: 'admin',
    canActivate: [composeGuards(authGuard, platformAdminGuard)],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'agencies',
        loadComponent: () =>
          import('./features/admin/admin-agencies.component').then(
            (m) => m.AdminAgenciesComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/admin-users.component').then(
            (m) => m.AdminUsersComponent
          ),
      },
    ],
  },

  // ============ Customer Routes ============
  {
    path: 'my-shipments',
    loadComponent: () =>
      import('./features/customer/customer-shipments.component').then(
        (m) => m.CustomerShipmentsComponent
      ),
    canActivate: [authGuard],
    data: { actorType: ActorType.CUSTOMER },
  },

  {
    path: 'track/:trackingNumber',
    loadComponent: () =>
      import('./features/tracking/public-tracking.component').then(
        (m) => m.PublicTrackingComponent
      ),
    // Public route - no auth required
  },

  // ============ User Profile ============
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },

  // ============ Error Routes ============
  {
    path: 'not-found',
    loadComponent: () =>
      import('./features/errors/not-found.component').then((m) => m.NotFoundComponent),
  },

  // ============ Wildcard ============
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
