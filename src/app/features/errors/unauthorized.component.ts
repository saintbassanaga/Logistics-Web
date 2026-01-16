import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import {KeycloakService} from '../../core';

/**
 * Unauthorized error page
 * Displayed when user lacks required permissions
 */
@Component({
  selector: 'app-unauthorized',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-page">
      <div class="error-content">
        <div class="error-icon">🔒</div>
        <h1 class="error-code">403</h1>
        <h2 class="error-title">Access Denied</h2>
        <p class="error-message">
          You don't have permission to access this page.
          Please contact your administrator if you believe this is an error.
        </p>
        <div class="error-actions">
          <button class="btn btn-primary" (click)="goBack()">
            Go Back
          </button>
          <button class="btn btn-secondary" (click)="goToDashboard()">
            Dashboard
          </button>
          @if (!keycloak.isAuthenticated()) {
            <button class="btn btn-outline" (click)="login()">
              Login
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .error-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .error-content {
      text-align: center;
      max-width: 500px;
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .error-code {
      font-size: 6rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .error-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #fff;
      margin: 1rem 0;
    }

    .error-message {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .btn-outline {
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `,
})
export class UnauthorizedComponent {
  protected readonly keycloak = inject(KeycloakService);
  private readonly router = inject(Router);

  protected goBack(): void {
    window.history.back();
  }

  protected goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  protected async login(): Promise<void> {
    await this.keycloak.login();
  }
}
