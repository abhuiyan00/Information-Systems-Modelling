import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin';
import { AuthService } from '../../../services/auth';
import { UserProfile } from '../../../models/auth';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html'
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  users: UserProfile[] = [];
  total = 0;
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
    this.adminService.getUsers().subscribe({
      next: r => {
        this.users = r.items ?? [];
        this.total = r.total ?? this.users.length;
      },
      error: err => {
        if (err.status === 403) this.forbidden = true;
      }
    });
  }
}
