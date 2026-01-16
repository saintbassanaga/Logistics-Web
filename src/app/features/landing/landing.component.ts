import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {KeycloakService} from '../../core';

/**
 * Public landing page
 * Displayed to unauthenticated users
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="landing">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-background">
          <div class="gradient-orb orb-1"></div>
          <div class="gradient-orb orb-2"></div>
          <div class="gradient-orb orb-3"></div>
        </div>

        <nav class="landing-nav">
          <div class="nav-brand">
            <span class="brand-icon">📦</span>
            <span class="brand-text">Logistics</span>
          </div>
          <button class="login-button" (click)="login()">
            Sign In
          </button>
        </nav>

        <div class="hero-content">
          <h1 class="hero-title">
            <span class="title-line">Modern Logistics</span>
            <span class="title-line gradient">Made Simple</span>
          </h1>
          <p class="hero-subtitle">
            A powerful multi-tenant platform for managing shipments,
            tracking parcels, and optimizing your logistics operations.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary" (click)="login()">
              Get Started
              <span class="btn-arrow">→</span>
            </button>
            <a href="#features" class="btn btn-ghost">
              Learn More
            </a>
          </div>
        </div>

        <div class="hero-visual">
          <div class="visual-card card-1">
            <span class="card-icon">🚚</span>
            <span class="card-label">Active Shipments</span>
            <span class="card-value">1,247</span>
          </div>
          <div class="visual-card card-2">
            <span class="card-icon">📦</span>
            <span class="card-label">Parcels Delivered</span>
            <span class="card-value">52.4K</span>
          </div>
          <div class="visual-card card-3">
            <span class="card-icon">⚡</span>
            <span class="card-label">On-time Rate</span>
            <span class="card-value">99.2%</span>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features">
        <div class="features-container">
          <h2 class="section-title">
            Everything you need to
            <span class="gradient">manage logistics</span>
          </h2>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🏢</div>
              <h3 class="feature-title">Multi-Tenant</h3>
              <p class="feature-description">
                Complete isolation between agencies with secure,
                tenant-specific data access.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🔐</div>
              <h3 class="feature-title">Zero Trust Security</h3>
              <p class="feature-description">
                Enterprise-grade security with JWT authentication
                and role-based access control.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📍</div>
              <h3 class="feature-title">Location Management</h3>
              <p class="feature-description">
                Manage headquarters, branches, warehouses,
                and pickup points in one place.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3 class="feature-title">Real-time Tracking</h3>
              <p class="feature-description">
                Track every parcel through its journey
                with live status updates.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🚀</div>
              <h3 class="feature-title">Scalable Platform</h3>
              <p class="feature-description">
                Built to handle thousands of shipments
                with enterprise reliability.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🔄</div>
              <h3 class="feature-title">API-First Design</h3>
              <p class="feature-description">
                Integrate with your existing systems
                through our comprehensive API.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="brand-icon">📦</span>
            <span class="brand-text">Logistics Platform</span>
          </div>
          <p class="footer-text">
            Built with Angular 20 & Spring Boot
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: `
    .landing {
      min-height: 100vh;
      background: #0f0f1a;
      color: #fff;
    }

    /* Hero Section */
    .hero {
      position: relative;
      min-height: 100vh;
      padding: 2rem;
      overflow: hidden;
    }

    .hero-background {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.5;
    }

    .orb-1 {
      width: 600px;
      height: 600px;
      background: #667eea;
      top: -200px;
      left: -200px;
      animation: float 20s ease-in-out infinite;
    }

    .orb-2 {
      width: 400px;
      height: 400px;
      background: #764ba2;
      bottom: -100px;
      right: -100px;
      animation: float 15s ease-in-out infinite reverse;
    }

    .orb-3 {
      width: 300px;
      height: 300px;
      background: #f093fb;
      top: 50%;
      left: 50%;
      animation: float 25s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0);
      }
      25% {
        transform: translate(50px, -50px);
      }
      50% {
        transform: translate(-30px, 30px);
      }
      75% {
        transform: translate(-50px, -30px);
      }
    }

    .landing-nav {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 0;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .brand-icon {
      font-size: 2rem;
    }

    .login-button {
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      color: #fff;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .login-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .hero-content {
      position: relative;
      max-width: 800px;
      margin: 8rem auto 4rem;
      text-align: center;
    }

    .hero-title {
      font-size: clamp(2.5rem, 8vw, 5rem);
      font-weight: 800;
      line-height: 1.1;
      margin: 0 0 1.5rem;
    }

    .title-line {
      display: block;
    }

    .gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .btn-arrow {
      transition: transform 0.2s ease;
    }

    .btn-primary:hover .btn-arrow {
      transform: translateX(4px);
    }

    .btn-ghost {
      background: transparent;
      color: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .hero-visual {
      position: relative;
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      margin-top: 4rem;
    }

    .visual-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem 2rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      animation: cardFloat 4s ease-in-out infinite;
    }

    .card-1 { animation-delay: 0s; }
    .card-2 { animation-delay: 0.5s; }
    .card-3 { animation-delay: 1s; }

    @keyframes cardFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .card-icon {
      font-size: 2rem;
    }

    .card-label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .card-value {
      font-size: 1.5rem;
      font-weight: 700;
    }

    /* Features Section */
    .features {
      position: relative;
      padding: 6rem 2rem;
      background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
    }

    .features-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 4rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      background: rgba(255, 255, 255, 0.05);
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.75rem;
    }

    .feature-description {
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.6;
      margin: 0;
    }

    /* Footer */
    .footer {
      padding: 2rem;
      background: #0a0a14;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
    }

    .footer-text {
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }

    @media (max-width: 768px) {
      .hero-content {
        margin-top: 4rem;
      }

      .hero-visual {
        flex-direction: column;
        align-items: center;
      }

      .visual-card {
        width: 100%;
        max-width: 280px;
      }

      .footer-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `,
})
export class LandingComponent {
  private readonly keycloak = inject(KeycloakService);

  protected async login(): Promise<void> {
    await this.keycloak.login();
  }
}
