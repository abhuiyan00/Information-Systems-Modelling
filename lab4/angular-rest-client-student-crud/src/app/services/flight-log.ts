import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FlightLog, FlightLogRequest } from '../models/flight-log';

@Injectable({ providedIn: 'root' })
export class FlightLogService {
  private http = inject(HttpClient);
  private apiBase = environment.apiBaseUrl;

  list(buildId: string): Observable<FlightLog[]> {
    return this.http.get<FlightLog[]>(`${this.apiBase}/builds/${buildId}/flight-logs`);
  }

  add(buildId: string, req: FlightLogRequest): Observable<FlightLog> {
    return this.http.post<FlightLog>(`${this.apiBase}/builds/${buildId}/flight-logs`, req);
  }
}
