import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Build, BuildList } from '../models/build';
import { ReviewRequest, AdminUsersResponse } from '../models/admin';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiBase = environment.apiBaseUrl;

  getQueue(): Observable<BuildList> {
    return this.http.get<BuildList>(`${this.apiBase}/admin/queue`);
  }

  getUsers(): Observable<AdminUsersResponse> {
    return this.http.get<AdminUsersResponse>(`${this.apiBase}/admin/users`);
  }

  review(buildId: string, req: ReviewRequest): Observable<Build> {
    return this.http.post<Build>(`${this.apiBase}/builds/${buildId}/review`, req);
  }
}
