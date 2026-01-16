import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

/**
 * 404 Not Found error page
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-page">
      <div class="error-content">
        <div class="error-illustration">
          <span class="box box-1">📦</span>
          <span class="box box-2">📦</span>
          <span class="box box-3">📦</span>
          <span class="question">❓</span>
        </div>
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-message">
          The page you're looking for seems to have wandered off.
          Perhaps it's still in transit?
        </p>
        <div class="error-actions">
          <button class="btn btn-primary" (click)="goHome()">
            Return Home
          </button>
          <button class="btn btn-secondary" (click)="goBack()">
            Go Back
          </button>
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

    .error-illustration {
      position: relative;
      height: 100px;
      margin-bottom: 1rem;
    }

    .box {
      position: absolute;
      font-size: 3rem;
      animation: float 3s ease-in-out infinite;
    }

    .box-1 {
      left: 30%;
      animation-delay: 0s;
    }

    .box-2 {
      left: 45%;
      animation-delay: 0.5s;
    }

    .box-3 {
      left: 60%;
      animation-delay: 1s;
    }

    .question {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 4rem;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.5;
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1);
      }
    }

    .error-code {
      font-size: 8rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
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
  `,
})
export class NotFoundComponent {
  private readonly router = inject(Router);

  protected goHome(): void {
    this.router.navigate(['/']);
  }

  protected goBack(): void {
    window.history.back();
  }
}
