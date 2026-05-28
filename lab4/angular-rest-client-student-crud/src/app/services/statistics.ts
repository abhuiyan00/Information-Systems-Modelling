import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Statistics } from '../models/statistics';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private http = inject(HttpClient);

  getStats(): Observable<Statistics> {
    return this.http.get<Statistics>(environment.apiBaseUrl + '/statistics');
  }
}
