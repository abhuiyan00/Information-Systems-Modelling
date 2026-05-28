import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StatisticsService } from '../../services/statistics';
import { AnalyticsService } from '../../services/analytics';
import { Statistics } from '../../models/statistics';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.html'
})
export class StatisticsComponent implements OnInit {
  private statsService = inject(StatisticsService);
  private analytics = inject(AnalyticsService);
  private auth = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  stats: Statistics | null = null;
  bundle: Record<string, Record<string, unknown>> | null = null;
  loading = true;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) { this.loading = false; return; }
    this.statsService.getStats().subscribe({
      next: s => { this.stats = s; },
      error: () => { this.stats = null; }
    });
    this.analytics.all().subscribe({
      next: b => { this.bundle = b; this.loading = false; },
      error: () => { this.bundle = null; this.loading = false; }
    });
  }

  isAdmin(): boolean { return this.auth.isAdmin(); }

  endpointKeys(stats: Statistics): string[] {
    return Object.keys(stats['endpoint_usage']);
  }

  keys(o: unknown): string[] {
    if (!o || typeof o !== 'object') return [];
    return Object.keys(o as Record<string, unknown>);
  }

  asArray(v: unknown): unknown[] {
    return Array.isArray(v) ? v : [];
  }

  asNumber(v: unknown): number {
    return typeof v === 'number' ? v : 0;
  }

  asString(v: unknown): string {
    return v == null ? '' : String(v);
  }

  get(o: unknown, k: string): unknown {
    if (!o || typeof o !== 'object') return null;
    return (o as Record<string, unknown>)[k] ?? null;
  }
}
