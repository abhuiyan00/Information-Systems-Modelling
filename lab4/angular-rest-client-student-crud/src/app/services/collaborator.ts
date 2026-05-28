import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Collaborator, InviteRequest } from '../models/collaborator';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  private http = inject(HttpClient);
  private apiBase = environment.apiBaseUrl;

  list(buildId: string): Observable<Collaborator[]> {
    return this.http.get<Collaborator[]>(`${this.apiBase}/builds/${buildId}/collaborators`);
  }

  invite(buildId: string, req: InviteRequest): Observable<void> {
    return this.http.post<void>(`${this.apiBase}/builds/${buildId}/collaborators`, req);
  }
}
