import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin';
import { AuthService } from '../../../services/auth';
import { Build } from '../../../models/build';

@Component({
  selector: 'app-admin-queue',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-queue.html'
})
export class AdminQueueComponent implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  builds: Build[] = [];
  message = '';
  forbidden = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.authService.isAdmin()) {
      this.forbidden = true;
      return;
    }
    this.reload();
  }

  reload(): void {
    this.adminService.getQueue().subscribe({
      next: r => (this.builds = r.items ?? []),
      error: err => {
        if (err.status === 403) this.forbidden = true;
      }
    });
  }

  approve(buildId: string): void {
    this.adminService.review(buildId, { action: 'approve' }).subscribe(() => {
      this.message = 'Build approved & published.';
      this.reload();
    });
  }

  reject(buildId: string): void {
    const reason = prompt('Reason for rejection (required):');
    if (!reason || !reason.trim()) return;
    this.adminService.review(buildId, { action: 'reject', reason: reason.trim() }).subscribe(() => {
      this.message = 'Build rejected.';
      this.reload();
    });
  }
}
