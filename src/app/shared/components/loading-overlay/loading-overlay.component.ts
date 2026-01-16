import { Component, input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Loading overlay component
 * Displays a full-screen loading indicator
 */
@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loading-overlay">
      <div class="loading-content">
        <div class="spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        @if (message()) {
          <p class="loading-message">{{ message() }}</p>
        }
      </div>
    </div>
  `,
  styles: `
    .loading-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      z-index: 9999;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }

    .spinner {
      position: relative;
      width: 80px;
      height: 80px;
    }

    .spinner-ring {
      position: absolute;
      inset: 0;
      border: 3px solid transparent;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }

    .spinner-ring:nth-child(1) {
      animation-delay: -0.45s;
    }

    .spinner-ring:nth-child(2) {
      inset: 8px;
      border-top-color: #764ba2;
      animation-delay: -0.3s;
    }

    .spinner-ring:nth-child(3) {
      inset: 16px;
      border-top-color: #f093fb;
      animation-delay: -0.15s;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .loading-message {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
    }
  `,
})
export class LoadingOverlayComponent {
  readonly message = input<string>('');
}
