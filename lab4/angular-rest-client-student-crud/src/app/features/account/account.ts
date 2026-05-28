import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account';
import { AuthService } from '../../services/auth';
import { UserProfile } from '../../models/auth';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.html'
})
export class AccountComponent implements OnInit {
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  user: UserProfile | null = null;
  busy = false;
  message = '';
  error = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  exportData(): void {
    this.busy = true;
    this.message = '';
    this.error = '';
    this.accountService.exportZip().subscribe({
      next: (blob) => {
        this.busy = false;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modellingclub-export.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        this.message = 'Export downloaded.';
      },
      error: (err) => {
        this.busy = false;
        this.error = err?.error?.message ?? 'Export failed.';
      }
    });
  }

  deleteAccount(): void {
    const confirmText = 'DELETE';
    const typed = prompt(`This will permanently delete your account. Builds will be reassigned to "system_user". Type "${confirmText}" to confirm:`);
    if (typed !== confirmText) return;
    this.busy = true;
    this.accountService.deleteAccount().subscribe({
      next: () => {
        this.busy = false;
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.busy = false;
        this.error = err?.error?.message ?? 'Delete failed.';
      }
    });
  }
}
