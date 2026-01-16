import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-shipment-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>Edit Shipment</h1>
      <p>Shipment edit form will be implemented here.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 800px; margin: 0 auto; }`,
})
export class ShipmentEditComponent {}
