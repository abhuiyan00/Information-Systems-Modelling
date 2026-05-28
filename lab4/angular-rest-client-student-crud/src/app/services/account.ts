import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private apiBase = environment.apiBaseUrl;

  exportZip(): Observable<Blob> {
    return this.http.get(`${this.apiBase}/account/export`, { responseType: 'blob' });
  }

  deleteAccount(): Observable<void> {
    return this.http.post<void>(`${this.apiBase}/account/delete`, {});
  }
}
