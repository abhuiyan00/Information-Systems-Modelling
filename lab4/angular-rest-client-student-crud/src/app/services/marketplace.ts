import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Listing {
  id: string;
  seller_id?: string;
  seller_username?: string;
  build_id?: string;
  title: string;
  part_category?: string;
  brand?: string;
  condition?: string;
  price_pln: number;
  currency?: string;
  status?: string;
  description?: string;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl + '/marketplace';

  list(status?: string, category?: string): Observable<Listing[]> {
    const params: string[] = [];
    if (status) params.push(`status=${status}`);
    if (category) params.push(`category=${category}`);
    const url = params.length ? `${this.base}?${params.join('&')}` : this.base;
    return this.http.get<Listing[]>(url);
  }
  get(id: string): Observable<Listing> { return this.http.get<Listing>(`${this.base}/${id}`); }
  create(body: Partial<Listing>): Observable<Listing> { return this.http.post<Listing>(this.base, body); }
  markSold(id: string): Observable<Listing> { return this.http.patch<Listing>(`${this.base}/${id}/sold`, {}); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}
