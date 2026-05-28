import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BuildService } from '../../services/build';
import { StatisticsService } from '../../services/statistics';
import { AuthService } from '../../services/auth';
import { Build } from '../../models/build';
import { Statistics } from '../../models/statistics';
import { BuildCardComponent } from '../../components/build-card/build-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, BuildCardComponent],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  private buildService = inject(BuildService);
  private statsService = inject(StatisticsService);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  builds: Build[] = [];
  recent: Build[] = [];
  stats: Statistics | null = null;

  totalBuilds = 0;
  publishedCount = 0;
  droneCount = 0;
  fixedWingCount = 0;

  ngOnInit(): void {
    // Skip data-loading on the server. Two reasons:
    //  - The backend may not be reachable from the SSR process.
    //  - Even when it is, the response would otherwise be cached by
    //    Angular's TransferState (we disable that, but belt + braces).
    // The browser will run ngOnInit again on hydration and fetch fresh.
    if (!isPlatformBrowser(this.platformId)) return;

    this.buildService.getAll().subscribe({
      next: list => {
        this.builds = list.items ?? [];
        this.totalBuilds = this.builds.length;
        this.publishedCount = this.builds.filter(b => b.status === 'published').length;
        this.droneCount = this.builds.filter(b => b.type === 'drone').length;
        this.fixedWingCount = this.builds.filter(b => b.type === 'fixed_wing').length;
        this.recent = this.builds
          .filter(b => b.status === 'published')
          .slice()
          .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
          .slice(0, 6);
      },
      error: () => (this.builds = [])
    });
    this.statsService.getStats().subscribe({
      next: s => (this.stats = s),
      error: () => (this.stats = null)
    });
  }

  isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  username(): string { return this.authService.getCurrentUser()?.username ?? 'pilot'; }
}
