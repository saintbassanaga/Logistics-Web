import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-parcel-tracking',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>Parcel Tracking</h1>
      <p>Parcel tracking timeline will be displayed here.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }`,
})
export class ParcelTrackingComponent {}
