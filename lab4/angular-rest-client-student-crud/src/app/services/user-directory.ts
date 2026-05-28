import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DirectoryUser {
  id: string;
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserDirectoryService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl + '/users';

  search(q: string): Observable<DirectoryUser[]> {
    const params = new HttpParams().set('q', q ?? '');
    return this.http.get<DirectoryUser[]>(this.base + '/search', { params });
  }
}
