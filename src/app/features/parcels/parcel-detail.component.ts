import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-parcel-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>Parcel Details</h1>
      <p>Parcel details will be displayed here.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }`,
})
export class ParcelDetailComponent {}
