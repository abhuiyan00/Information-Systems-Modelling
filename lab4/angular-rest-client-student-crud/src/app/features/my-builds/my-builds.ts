import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { BuildService } from '../../services/build';
import { AuthService } from '../../services/auth';
import { Build, BuildStatus } from '../../models/build';
import { BuildCardComponent } from '../../components/build-card/build-card';

type StatusFilter = 'all' | BuildStatus;

@Component({
  selector: 'app-my-builds',
  standalone: true,
  imports: [CommonModule, RouterLink, BuildCardComponent],
  templateUrl: './my-builds.html'
})
export class MyBuildsComponent implements OnInit {
  private buildService = inject(BuildService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  mine: Build[] = [];
  visible: Build[] = [];
  status: StatusFilter = 'all';

  counts: Record<StatusFilter, number> = {
    all: 0, draft: 0, pending_review: 0, published: 0, rejected: 0, archived: 0
  };

  ngOnInit(): void {
    // Auth-state lives in localStorage which is not present during SSR.
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const me = this.authService.getCurrentUser();
    this.buildService.getAll().subscribe({
      next: result => {
        const all = result.items ?? [];
        this.mine = me ? all.filter(b => b.owner_id === me.id) : [];
        this.recount();
        this.applyStatus(this.status);
      },
      error: () => (this.mine = [])
    });
  }

  private recount(): void {
    this.counts = {
      all: this.mine.length,
      draft: this.mine.filter(b => b.status === 'draft').length,
      pending_review: this.mine.filter(b => b.status === 'pending_review').length,
      published: this.mine.filter(b => b.status === 'published').length,
      rejected: this.mine.filter(b => b.status === 'rejected').length,
      archived: this.mine.filter(b => b.status === 'archived').length
    };
  }

  applyStatus(s: StatusFilter): void {
    this.status = s;
    this.visible = s === 'all' ? this.mine : this.mine.filter(b => b.status === s);
  }
}
