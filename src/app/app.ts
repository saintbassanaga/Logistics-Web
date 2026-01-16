import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoadingOverlayComponent} from './shared/components/loading-overlay/loading-overlay.component';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {KeycloakService} from './core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingOverlayComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Logistics');
  protected readonly keycloak = inject(KeycloakService);
}
