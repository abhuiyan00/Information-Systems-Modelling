import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, UserProfile } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly TOKEN_KEY = 'mcb_jwt';
  private readonly USER_KEY = 'mcb_user';
  private apiBase = environment.apiBaseUrl;

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiBase + '/auth/login', req).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        }
      })
    );
  }

  register(req: RegisterRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiBase + '/auth/register', req);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try { return localStorage.getItem(this.TOKEN_KEY); } catch { return null; }
  }

  getCurrentUser(): UserProfile | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch { return null; }
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }
}
