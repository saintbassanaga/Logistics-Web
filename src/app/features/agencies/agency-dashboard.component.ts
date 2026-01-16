import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-agency-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>Agency Dashboard</h1>
      <p>Agency management dashboard will be displayed here.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }`,
})
export class AgencyDashboardComponent {}
