import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { KeycloakService } from '../../core';

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .nav-link {
      position: relative;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      transition: width 0.3s ease;
    }
    .nav-link:hover::after {
      width: 70%;
    }
  `,
  template: `
    <div class="min-h-screen bg-white text-slate-800">

      <!-- Navigation - Clean Leadpages-inspired -->
      <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex items-center justify-between h-16">

            <!-- Logo -->
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <span class="font-semibold text-slate-900">Logistics</span>
            </div>

            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center gap-8">
              <a href="#features" class="nav-link text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-1">
                Features
              </a>
              <a href="#solutions" class="nav-link text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-1">
                Solutions
              </a>
              <a href="#pricing" class="nav-link text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-1">
                Pricing
              </a>
              <a href="#resources" class="nav-link text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-1">
                Resources
              </a>
            </nav>

            <!-- CTA Buttons -->
            <div class="flex items-center gap-3">
              <button
                (click)="login()"
                class="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Log in
              </button>
              <button
                (click)="login()"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg
                       hover:bg-indigo-700 transition-colors"
              >
                Start Free
              </button>
            </div>

          </div>
        </div>
      </header>

      <main>
        <!-- Hero Section - Clean & Focused -->
        <section class="relative overflow-hidden">
          <!-- Subtle gradient background -->
          <div class="absolute inset-0 bg-gradient-to-b from-slate-50 to-white"></div>
          <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent"></div>

          <div class="relative max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
            <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              <!-- Left Content -->
              <div class="max-w-xl">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full mb-6">
                  <span class="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                  <span class="text-xs font-medium text-indigo-700 uppercase tracking-wide">Enterprise Logistics</span>
                </div>

                <h1 class="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] text-slate-900 tracking-tight">
                  Deliver faster.
                  <span class="block text-indigo-600">Track smarter.</span>
                </h1>

                <p class="mt-6 text-lg text-slate-600 leading-relaxed">
                  The all-in-one platform for managing parcels, shipments, and delivery workflows.
                  Built for teams that move fast.
                </p>

                <div class="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    (click)="login()"
                    class="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white
                           bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm
                           hover:shadow-md"
                  >
                    Start free trial
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </button>
                  <button
                    class="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-slate-700
                           bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300
                           transition-all"
                  >
                    <svg class="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Watch demo
                  </button>
                </div>

                <!-- Social proof -->
                <div class="mt-10 pt-8 border-t border-slate-100">
                  <p class="text-sm text-slate-500 mb-4">Trusted by logistics teams worldwide</p>
                  <div class="flex items-center gap-8">
                    <div class="text-center">
                      <p class="text-2xl font-bold text-slate-900">128+</p>
                      <p class="text-xs text-slate-500">Agencies</p>
                    </div>
                    <div class="w-px h-10 bg-slate-200"></div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-slate-900">1.2M</p>
                      <p class="text-xs text-slate-500">Parcels/month</p>
                    </div>
                    <div class="w-px h-10 bg-slate-200"></div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-slate-900">99.1%</p>
                      <p class="text-xs text-slate-500">Delivery rate</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right - Dashboard Preview -->
              <div class="relative lg:pl-8">
                <div class="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  <!-- Mock dashboard header -->
                  <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                    <div class="flex gap-1.5">
                      <div class="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div class="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div class="w-3 h-3 rounded-full bg-slate-200"></div>
                    </div>
                    <div class="flex-1 h-6 bg-white rounded border border-slate-200 max-w-xs"></div>
                  </div>

                  <!-- Dashboard content -->
                  <div class="p-6">
                    <div class="grid grid-cols-2 gap-4 mb-6">
                      <div class="p-4 bg-indigo-50 rounded-xl">
                        <p class="text-xs font-medium text-indigo-600 mb-1">Active Shipments</p>
                        <p class="text-2xl font-bold text-slate-900">1,247</p>
                      </div>
                      <div class="p-4 bg-green-50 rounded-xl">
                        <p class="text-xs font-medium text-green-600 mb-1">On Time</p>
                        <p class="text-2xl font-bold text-slate-900">98.5%</p>
                      </div>
                    </div>

                    <!-- Mock chart area -->
                    <div class="h-32 bg-gradient-to-t from-indigo-50 to-white rounded-xl flex items-end justify-around px-4 pb-4">
                      <div class="w-8 bg-indigo-200 rounded-t" style="height: 40%"></div>
                      <div class="w-8 bg-indigo-300 rounded-t" style="height: 60%"></div>
                      <div class="w-8 bg-indigo-400 rounded-t" style="height: 45%"></div>
                      <div class="w-8 bg-indigo-500 rounded-t" style="height: 80%"></div>
                      <div class="w-8 bg-indigo-600 rounded-t" style="height: 70%"></div>
                      <div class="w-8 bg-indigo-500 rounded-t" style="height: 90%"></div>
                    </div>
                  </div>
                </div>

                <!-- Floating card -->
                <div class="absolute -left-4 bottom-8 bg-white rounded-xl shadow-lg border border-slate-100 p-4 max-w-[200px]">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-slate-900">Delivered</p>
                      <p class="text-xs text-slate-500">PKG-8392 completed</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-20 lg:py-28 bg-slate-50">
          <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-2xl mx-auto mb-16">
              <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Everything you need to ship with confidence
              </h2>
              <p class="mt-4 text-lg text-slate-600">
                Powerful tools designed for modern logistics operations.
              </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              @for (feature of features; track feature.title) {
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                       [class]="feature.bgColor">
                    <svg class="w-6 h-6" [class]="feature.iconColor" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="feature.icon"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-slate-900 mb-2">{{ feature.title }}</h3>
                  <p class="text-slate-600 text-sm leading-relaxed">{{ feature.description }}</p>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 lg:py-28">
          <div class="max-w-7xl mx-auto px-6">
            <div class="relative bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl overflow-hidden">
              <!-- Pattern overlay -->
              <div class="absolute inset-0 opacity-10">
                <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)"/>
                </svg>
              </div>

              <div class="relative px-8 py-16 lg:px-16 lg:py-20 text-center">
                <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to streamline your logistics?
                </h2>
                <p class="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Join hundreds of companies already using our platform to deliver faster and track smarter.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    (click)="login()"
                    class="inline-flex items-center justify-center px-6 py-3 text-base font-medium
                           bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Get started free
                  </button>
                  <button
                    class="inline-flex items-center justify-center px-6 py-3 text-base font-medium
                           text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Talk to sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="bg-slate-900 text-slate-400">
        <div class="max-w-7xl mx-auto px-6 py-12">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div class="col-span-2 md:col-span-1">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <span class="font-semibold text-white">Logistics</span>
              </div>
              <p class="text-sm text-slate-500">
                The modern platform for logistics operations.
              </p>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-white mb-4">Product</h4>
              <ul class="space-y-3 text-sm">
                <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-white mb-4">Company</h4>
              <ul class="space-y-3 text-sm">
                <li><a href="#" class="hover:text-white transition-colors">About</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul class="space-y-3 text-sm">
                <li><a href="#" class="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div class="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm">© {{ year }} Logistics Platform. All rights reserved.</p>
            <div class="flex items-center gap-4">
              <a href="#" class="text-slate-500 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" class="text-slate-500 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" class="text-slate-500 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  `
})
export class LandingComponent {
  private readonly keycloak = inject(KeycloakService);
  protected readonly year = new Date().getFullYear();

  protected readonly features = [
    {
      title: 'Agency Management',
      description: 'Manage headquarters, branches, warehouses, and pickup points with full tenant isolation.',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Parcel Tracking',
      description: 'Track parcels from creation to final delivery with full traceability and real-time updates.',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      bgColor: 'bg-violet-100',
      iconColor: 'text-violet-600'
    },
    {
      title: 'Smart Routing',
      description: 'Organize shipments, assign optimized routes, and monitor delivery progress in real-time.',
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Enterprise Security',
      description: 'Zero-trust security with JWT, RBAC, and tenant-aware access control for data protection.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Full Audit Trail',
      description: 'Complete history of parcel movements and system actions for compliance and transparency.',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      title: 'API & Integrations',
      description: 'API-first architecture for seamless integration with external systems and partners.',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-600'
    }
  ];

  protected async login(): Promise<void> {
    await this.keycloak.login();
  }
}
