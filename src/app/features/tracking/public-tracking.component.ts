import { Component, input, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

/**
 * Public parcel tracking component
 * Allows tracking without authentication
 */
@Component({
  selector: 'app-public-tracking',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tracking-page">
      <div class="tracking-container">
        <header class="tracking-header">
          <div class="brand">
            <span class="brand-icon">📦</span>
            <span class="brand-text">Track Your Parcel</span>
          </div>
        </header>

        <div class="search-section">
          <div class="search-box">
            <input
              type="text"
              class="search-input"
              placeholder="Enter tracking number..."
              [(ngModel)]="searchQuery"
              (keyup.enter)="search()"
            />
            <button class="search-button" (click)="search()">
              Track
            </button>
          </div>
        </div>

        @if (isLoading()) {
          <div class="loading">
            <div class="spinner"></div>
            <p>Searching...</p>
          </div>
        }

        @if (parcelInfo()) {
          <div class="result-section">
            <div class="parcel-card">
              <div class="parcel-header">
                <div class="parcel-main">
                  <span class="tracking-number">{{ parcelInfo()?.trackingNumber }}</span>
                  <span class="status-badge" [attr.data-status]="parcelInfo()?.status">
                    {{ parcelInfo()?.status }}
                  </span>
                </div>
                <div class="parcel-meta">
                  <span>From: {{ parcelInfo()?.origin }}</span>
                  <span>To: {{ parcelInfo()?.destination }}</span>
                </div>
              </div>

              <div class="timeline">
                @for (event of trackingEvents(); track $index) {
                  <div class="timeline-item" [class.current]="$first">
                    <div class="timeline-marker">
                      @if ($first) {
                        <span class="marker-dot active"></span>
                      } @else {
                        <span class="marker-dot"></span>
                      }
                      @if (!$last) {
                        <span class="marker-line"></span>
                      }
                    </div>
                    <div class="timeline-content">
                      <div class="event-header">
                        <span class="event-status">{{ event.status }}</span>
                        <span class="event-time">{{ event.timestamp }}</span>
                      </div>
                      <p class="event-description">{{ event.description }}</p>
                      <span class="event-location">📍 {{ event.location }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        @if (notFound()) {
          <div class="not-found">
            <span class="not-found-icon">🔍</span>
            <h3>Parcel Not Found</h3>
            <p>We couldn't find a parcel with that tracking number. Please check and try again.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .tracking-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 2rem;
    }

    .tracking-container {
      max-width: 700px;
      margin: 0 auto;
    }

    .tracking-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      color: #fff;
    }

    .brand-icon {
      font-size: 2.5rem;
    }

    .brand-text {
      font-size: 1.75rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .search-section {
      margin-bottom: 2rem;
    }

    .search-box {
      display: flex;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 0.5rem;
    }

    .search-input {
      flex: 1;
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      color: #fff;
      font-size: 1rem;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .search-input:focus {
      outline: none;
    }

    .search-button {
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 12px;
      color: #fff;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .search-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #667eea;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .parcel-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2rem;
      backdrop-filter: blur(10px);
    }

    .parcel-header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .parcel-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .tracking-number {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge[data-status="DELIVERED"] {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .status-badge[data-status="IN_TRANSIT"] {
      background: rgba(102, 126, 234, 0.2);
      color: #667eea;
    }

    .status-badge[data-status="PENDING"] {
      background: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
    }

    .parcel-meta {
      display: flex;
      gap: 2rem;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
      flex-wrap: wrap;
    }

    .timeline {
      display: flex;
      flex-direction: column;
    }

    .timeline-item {
      display: flex;
      gap: 1.5rem;
    }

    .timeline-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .marker-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .marker-dot.active {
      background: #667eea;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.3);
    }

    .marker-line {
      flex: 1;
      width: 2px;
      background: rgba(255, 255, 255, 0.1);
      min-height: 40px;
    }

    .timeline-content {
      flex: 1;
      padding-bottom: 2rem;
    }

    .timeline-item.current .timeline-content {
      color: #fff;
    }

    .timeline-item:not(.current) .timeline-content {
      color: rgba(255, 255, 255, 0.5);
    }

    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .event-status {
      font-weight: 600;
    }

    .event-time {
      font-size: 0.75rem;
      opacity: 0.7;
    }

    .event-description {
      margin: 0 0 0.5rem;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .event-location {
      font-size: 0.75rem;
      opacity: 0.7;
    }

    .not-found {
      text-align: center;
      padding: 3rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
    }

    .not-found-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }

    .not-found h3 {
      color: #fff;
      margin: 0 0 0.5rem;
    }

    .not-found p {
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }
  `,
})
export class PublicTrackingComponent implements OnInit {
  /** Route parameter for tracking number */
  readonly trackingNumber = input<string>();

  protected searchQuery = '';
  protected readonly isLoading = signal(false);
  protected readonly notFound = signal(false);
  protected readonly parcelInfo = signal<{
    trackingNumber: string;
    status: string;
    origin: string;
    destination: string;
  } | null>(null);
  protected readonly trackingEvents = signal<TrackingEvent[]>([]);

  ngOnInit(): void {
    const trackingNum = this.trackingNumber();
    if (trackingNum) {
      this.searchQuery = trackingNum;
      this.search();
    }
  }

  protected search(): void {
    if (!this.searchQuery.trim()) return;

    this.isLoading.set(true);
    this.notFound.set(false);
    this.parcelInfo.set(null);

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);

      // Mock data - replace with actual API call
      if (this.searchQuery.toLowerCase().includes('not')) {
        this.notFound.set(true);
      } else {
        this.parcelInfo.set({
          trackingNumber: this.searchQuery.toUpperCase(),
          status: 'IN_TRANSIT',
          origin: 'Paris, France',
          destination: 'Lyon, France',
        });

        this.trackingEvents.set([
          {
            status: 'In Transit',
            location: 'Lyon Sorting Center',
            timestamp: 'Jan 15, 2024 - 14:30',
            description: 'Parcel arrived at local sorting center',
          },
          {
            status: 'Departed',
            location: 'Paris Hub',
            timestamp: 'Jan 15, 2024 - 08:15',
            description: 'Parcel departed from origin hub',
          },
          {
            status: 'Picked Up',
            location: 'Paris Branch Office',
            timestamp: 'Jan 14, 2024 - 16:45',
            description: 'Parcel picked up from sender',
          },
          {
            status: 'Shipment Created',
            location: 'Online',
            timestamp: 'Jan 14, 2024 - 10:00',
            description: 'Shipping label created',
          },
        ]);
      }
    }, 1000);
  }
}
