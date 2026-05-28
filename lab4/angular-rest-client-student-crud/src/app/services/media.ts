import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MediaFile } from '../models/media';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private http = inject(HttpClient);
  private apiBase = environment.apiBaseUrl;

  list(buildId: string): Observable<MediaFile[]> {
    return this.http.get<MediaFile[]>(`${this.apiBase}/builds/${buildId}/media`);
  }

  upload(buildId: string, files: File[]): Observable<MediaFile[]> {
    const fd = new FormData();
    for (const f of files) fd.append('files', f, f.name);
    // Don't set Content-Type — the browser fills the multipart boundary in.
    return this.http.post<MediaFile[]>(`${this.apiBase}/builds/${buildId}/media`, fd);
  }

  delete(buildId: string, mediaId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/builds/${buildId}/media/${mediaId}`);
  }
}
