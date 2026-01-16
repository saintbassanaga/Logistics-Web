import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>Shipment Details</h1>
      <p>Shipment details will be displayed here.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }`,
})
export class ShipmentDetailComponent {}
