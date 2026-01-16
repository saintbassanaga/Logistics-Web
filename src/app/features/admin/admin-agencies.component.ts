import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-agencies',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>Manage Agencies</h1>
      <p>Agency management for platform admins.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }`,
})
export class AdminAgenciesComponent {}
