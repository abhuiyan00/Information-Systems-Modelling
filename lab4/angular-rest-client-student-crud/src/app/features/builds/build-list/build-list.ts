import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BuildService } from '../../../services/build';
import { AuthService } from '../../../services/auth';
import { Build } from '../../../models/build';
import { BuildCardComponent } from '../../../components/build-card/build-card';
import { SearchBarComponent, BuildFilters } from '../../../components/search-bar/search-bar';
import { BuildType } from '../../../models/build';

/**
 * Public Explore page — grid of published builds with search/type filter.
 * (Mounted at /builds and /explore — same component.)
 */
@Component({
  selector: 'app-build-list',
  standalone: true,
  imports: [CommonModule, RouterLink, BuildCardComponent, SearchBarComponent],
  templateUrl: './build-list.html'
})
export class BuildListComponent implements OnInit {
  private buildService = inject(BuildService);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  allBuilds: Build[] = [];
  visibleBuilds: Build[] = [];
  filters: BuildFilters = { query: '', type: 'all' };

  ngOnInit(): void { this.reload(); }

  reload(): void {
    // Don't fetch during SSR — see HomeComponent for the rationale.
    if (!isPlatformBrowser(this.platformId)) return;
    this.buildService.getAll().subscribe({
      next: result => {
        this.allBuilds = (result.items ?? []).filter(b => b.status === 'published');
        this.applyFilters();
      },
      error: () => (this.allBuilds = [])
    });
  }

  onFiltersChange(filters: BuildFilters): void {
    this.filters = filters;
    this.applyFilters();
  }

  private applyFilters(): void {
    const q = this.filters.query.trim().toLowerCase();
    const t = this.filters.type;
    this.visibleBuilds = this.allBuilds.filter(b => {
      if (t !== 'all' && b.type !== t) return false;
      if (!q) return true;
      const hay = (b.title + ' ' + (b.description ?? '')).toLowerCase();
      return hay.includes(q);
    });
  }

  isLoggedIn(): boolean { return this.authService.isLoggedIn(); }

  readonly chipTypes: { value: string; label: string }[] = [
    { value: 'all',         label: 'All' },
    { value: 'drone',       label: 'Drones' },
    { value: 'helicopter',  label: 'Helicopters' },
    { value: 'fixed_wing',  label: 'Planes' },
    { value: 'boat',        label: 'Boats' },
    { value: 'car',         label: 'Cars' },
    { value: 'scale_model', label: 'Scale models' }
  ];

  setType(t: string): void {
    this.filters = { ...this.filters, type: t as BuildType | 'all' };
    this.applyFilters();
  }
}
