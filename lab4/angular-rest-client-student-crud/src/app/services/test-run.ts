import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TestRun {
  id: string;
  build_id?: string;
  organizer_id?: string;
  organizer_username?: string;
  scheduled_at: string;
  location_name?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  weather?: string;
  max_participants?: number;
  status?: string;
  success_rating?: number;
}

@Injectable({ providedIn: 'root' })
export class TestRunService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl + '/test-runs';

  list(status?: string): Observable<TestRun[]> {
    const url = status ? `${this.base}?status=${status}` : this.base;
    return this.http.get<TestRun[]>(url);
  }
  get(id: string): Observable<TestRun> { return this.http.get<TestRun>(`${this.base}/${id}`); }
  create(body: Partial<TestRun>): Observable<TestRun> { return this.http.post<TestRun>(this.base, body); }
  join(id: string, distanceKm?: number): Observable<unknown> {
    return this.http.post(`${this.base}/${id}/attendees`, { distance_km: distanceKm ?? null });
  }
  attendees(id: string): Observable<unknown[]> { return this.http.get<unknown[]>(`${this.base}/${id}/attendees`); }
}
