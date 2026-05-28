import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserProfile } from '../../models/auth';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './site-header.html'
})
export class SiteHeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoggedIn(): boolean { return this.auth.isLoggedIn(); }
  isAdmin(): boolean { return this.auth.isAdmin(); }
  currentUser(): UserProfile | null { return this.auth.getCurrentUser(); }
  logout(): void { this.auth.logout(); this.router.navigate(['/login']); }
}
