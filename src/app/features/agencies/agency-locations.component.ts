import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-agency-locations',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>Agency Locations</h1>
      <p>Location management will be displayed here.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }`,
})
export class AgencyLocationsComponent {}
