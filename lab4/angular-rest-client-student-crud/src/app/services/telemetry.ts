import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Telemetry {
  id: string;
  build_id?: string;
  recorded_at?: string;
  max_speed_kmh?: number;
  duration_sec?: number;
  battery_used_pct?: number;
  range_m?: number;
  max_altitude_m?: number;
  crash_count?: number;
  terrain?: string;
  lap_time_sec?: number;
}

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  list(buildId: string): Observable<Telemetry[]> {
    return this.http.get<Telemetry[]>(`${this.base}/builds/${buildId}/telemetry`);
  }
  add(buildId: string, body: Partial<Telemetry>): Observable<Telemetry> {
    return this.http.post<Telemetry>(`${this.base}/builds/${buildId}/telemetry`, body);
  }
}
