import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Message {
  id: string;
  sender_id?: string;
  sender_username?: string;
  recipient_id?: string;
  recipient_username?: string;
  content: string;
  read?: boolean;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl + '/messages';

  inbox(): Observable<Message[]> { return this.http.get<Message[]>(this.base); }
  send(recipientId: string, content: string): Observable<Message> {
    return this.http.post<Message>(this.base, { recipient_id: recipientId, content });
  }
}
