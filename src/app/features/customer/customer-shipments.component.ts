import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-customer-shipments',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <h1>My Shipments</h1>
      <p>Customer's shipments will be displayed here.</p>
    </div>
  `,
  styles: `.page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }`,
})
export class CustomerShipmentsComponent {}
