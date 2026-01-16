import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-shipment-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>Create Shipment</h1>
      <p>Shipment creation form will be implemented here.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 800px; margin: 0 auto; }`,
})
export class ShipmentCreateComponent {}
