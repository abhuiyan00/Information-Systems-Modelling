import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl + '/analytics';

  dashboard():   Observable<Record<string, unknown>> { return this.http.get<Record<string, unknown>>(this.base + '/dashboard'); }
  community():   Observable<Record<string, unknown>> { return this.http.get<Record<string, unknown>>(this.base + '/community'); }
  testRuns():    Observable<Record<string, unknown>> { return this.http.get<Record<string, unknown>>(this.base + '/test-runs'); }
  builds():      Observable<Record<string, unknown>> { return this.http.get<Record<string, unknown>>(this.base + '/builds'); }
  telemetry():   Observable<Record<string, unknown>> { return this.http.get<Record<string, unknown>>(this.base + '/telemetry'); }
  geography():   Observable<Record<string, unknown>> { return this.http.get<Record<string, unknown>>(this.base + '/geography'); }
  marketplace(): Observable<Record<string, unknown>> { return this.http.get<Record<string, unknown>>(this.base + '/marketplace'); }
  social():     Observable<Record<string, unknown>> { return this.http.get<Record<string, unknown>>(this.base + '/social'); }
  ai():         Observable<Record<string, unknown>> { return this.http.get<Record<string, unknown>>(this.base + '/ai'); }

  all(): Observable<Record<string, Record<string, unknown>>> {
    return forkJoin({
      dashboard:   this.dashboard(),
      community:   this.community(),
      testRuns:    this.testRuns(),
      builds:      this.builds(),
      telemetry:   this.telemetry(),
      geography:   this.geography(),
      marketplace: this.marketplace(),
      social:      this.social(),
      ai:          this.ai()
    });
  }
}
