import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-parcel-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>Parcels</h1>
      <p>Parcel list will be displayed here.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }`,
})
export class ParcelListComponent {}
