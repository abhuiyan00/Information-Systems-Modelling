import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Build, BuildList, BuildPayload } from '../models/build';
import { Comment, CommentRequest } from '../models/comment';
import { VoteRequest, VoteResponse } from '../models/vote';

@Injectable({ providedIn: 'root' })
export class BuildService {
  private http = inject(HttpClient);
  private apiBase = environment.apiBaseUrl;

  getAll(): Observable<BuildList> {
    return this.http.get<BuildList>(this.apiBase + '/builds');
  }

  getById(id: string): Observable<Build> {
    return this.http.get<Build>(this.apiBase + '/builds/' + id);
  }

  create(payload: BuildPayload): Observable<Build> {
    return this.http.post<Build>(this.apiBase + '/builds', payload);
  }

  update(id: string, payload: BuildPayload): Observable<Build> {
    return this.http.put<Build>(this.apiBase + '/builds/' + id, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiBase + '/builds/' + id);
  }

  submit(id: string): Observable<Build> {
    return this.http.post<Build>(this.apiBase + '/builds/' + id + '/submit', {});
  }

  getComments(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiBase + '/builds/' + id + '/comments');
  }

  postComment(id: string, req: CommentRequest): Observable<Comment> {
    return this.http.post<Comment>(this.apiBase + '/builds/' + id + '/comments', req);
  }

  getVotes(id: string): Observable<VoteResponse> {
    return this.http.get<VoteResponse>(this.apiBase + '/builds/' + id + '/vote');
  }

  castVote(id: string, req: VoteRequest): Observable<VoteResponse> {
    return this.http.post<VoteResponse>(this.apiBase + '/builds/' + id + '/vote', req);
  }
}
