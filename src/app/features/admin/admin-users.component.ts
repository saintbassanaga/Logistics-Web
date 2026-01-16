import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>Manage Users</h1>
      <p>User management for platform admins.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }`,
})
export class AdminUsersComponent {}
