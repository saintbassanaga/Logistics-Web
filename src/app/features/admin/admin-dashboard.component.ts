import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>Platform Administration</h1>
      <p>Platform admin dashboard will be displayed here.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }`,
})
export class AdminDashboardComponent {}
