import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { BuildService } from '../../../services/build';
import { AuthService } from '../../../services/auth';
import { MediaService } from '../../../services/media';
import { FlightLogService } from '../../../services/flight-log';
import { CollaboratorService } from '../../../services/collaborator';
import { Build } from '../../../models/build';
import { Comment, CommentRequest } from '../../../models/comment';
import { VoteResponse } from '../../../models/vote';
import { MediaFile } from '../../../models/media';
import { FlightLog } from '../../../models/flight-log';
import { Collaborator } from '../../../models/collaborator';

@Component({
  selector: 'app-build-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './build-detail.html'
})
export class BuildDetailComponent implements OnInit {
  private buildService = inject(BuildService);
  private authService = inject(AuthService);
  private mediaService = inject(MediaService);
  private flightLogService = inject(FlightLogService);
  private collaboratorService = inject(CollaboratorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  build: Build | null = null;
  comments: Comment[] = [];
  votes: VoteResponse | null = null;
  media: MediaFile[] = [];
  flightLogs: FlightLog[] = [];
  collaborators: Collaborator[] = [];

  uploadError = '';
  uploadBusy = false;
  isDragOver = false;

  inviteError = '';
  inviteSuccess = '';

  flightLogError = '';
  flightLogSuccess = '';

  submitMessage = '';

  buildId = '';

  commentForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  inviteForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  flightLogForm = this.fb.nonNullable.group({
    flight_date:      ['', Validators.required],
    location_name:    ['', [Validators.required, Validators.maxLength(200)]],
    duration_min:     [10, [Validators.required, Validators.min(1), Validators.max(600)]],
    max_altitude_m:   [50, [Validators.required, Validators.min(0), Validators.max(120)]],
    drone_identifier: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}-[A-Z0-9]{6,12}$/)]],
    conditions:       ['SUNNY' as 'SUNNY' | 'CLOUDY' | 'WINDY' | 'RAIN', Validators.required],
    notebook:         ['', Validators.maxLength(1000)]
  });

  ngOnInit(): void {
    this.buildId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadBuild();
    this.loadComments();
    this.loadVotes();
    this.loadMedia();
    if (this.isLoggedIn()) {
      this.loadCollaborators();
    }
  }

  isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  isAdmin(): boolean { return this.authService.isAdmin(); }

  isOwner(): boolean {
    const me = this.authService.getCurrentUser();
    return !!me && !!this.build && me.id === this.build.owner_id;
  }

  canEdit(): boolean { return this.isOwner() || this.isAdmin(); }

  loadBuild(): void {
    this.buildService.getById(this.buildId).subscribe(b => {
      this.build = b;
      if (b.type === 'drone' && this.isLoggedIn()) {
        this.loadFlightLogs();
      }
    });
  }

  loadComments(): void {
    this.buildService.getComments(this.buildId).subscribe(c => (this.comments = c));
  }

  loadVotes(): void {
    this.buildService.getVotes(this.buildId).subscribe(v => (this.votes = v));
  }

  loadMedia(): void {
    this.mediaService.list(this.buildId).subscribe(m => (this.media = m));
  }

  loadFlightLogs(): void {
    this.flightLogService.list(this.buildId).subscribe({
      next: l => (this.flightLogs = l),
      error: () => (this.flightLogs = [])
    });
  }

  loadCollaborators(): void {
    this.collaboratorService.list(this.buildId).subscribe({
      next: c => (this.collaborators = c),
      error: () => (this.collaborators = [])
    });
  }

  submitComment(): void {
    if (this.commentForm.invalid || !this.isLoggedIn()) return;
    const req: CommentRequest = this.commentForm.getRawValue();
    this.buildService.postComment(this.buildId, req).subscribe(() => {
      this.commentForm.reset();
      this.loadComments();
    });
  }

  castVote(direction: 'up' | 'down'): void {
    this.buildService.castVote(this.buildId, { vote: direction }).subscribe({
      next: () => this.loadVotes(),
      error: (err) => {
        if (err.status === 400) alert('You cannot vote on your own build.');
      }
    });
  }

  // ── Media ────────────────────────────────────────────────────────────
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }
  onDragLeave(): void { this.isDragOver = false; }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (!event.dataTransfer) return;
    this.handleFiles(Array.from(event.dataTransfer.files));
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.handleFiles(Array.from(input.files));
    input.value = '';
  }

  private handleFiles(files: File[]): void {
    if (files.length === 0) return;
    this.uploadError = '';
    this.uploadBusy = true;
    this.mediaService.upload(this.buildId, files).subscribe({
      next: () => {
        this.uploadBusy = false;
        this.loadMedia();
      },
      error: (err) => {
        this.uploadBusy = false;
        if (err.status === 400) this.uploadError = 'Upload rejected — file type, size, or count limit exceeded.';
        else if (err.status === 401) this.uploadError = 'Please log in to upload files.';
        else this.uploadError = err?.error?.message ?? 'Upload failed.';
      }
    });
  }

  isImage(m: MediaFile): boolean {
    return !!m.mime_type && m.mime_type.startsWith('image/');
  }

  deleteMedia(mediaId: string): void {
    if (!confirm('Delete this file?')) return;
    this.mediaService.delete(this.buildId, mediaId).subscribe(() => this.loadMedia());
  }

  // ── Submit for review ────────────────────────────────────────────────
  submitForReview(): void {
    if (!this.build?.id) return;
    if (!confirm('Submit this build for admin review? You will not be able to edit it until reviewed.')) return;
    this.buildService.submit(this.build.id).subscribe({
      next: () => {
        this.submitMessage = 'Submitted for review.';
        this.loadBuild();
      },
      error: (err) => (this.submitMessage = err?.error?.message ?? 'Submit failed.')
    });
  }

  // ── Collaborators ────────────────────────────────────────────────────
  inviteCollaborator(): void {
    if (this.inviteForm.invalid) return;
    this.inviteError = '';
    this.inviteSuccess = '';
    this.collaboratorService.invite(this.buildId, this.inviteForm.getRawValue()).subscribe({
      next: () => {
        this.inviteSuccess = 'Invitation accepted — collaborator added.';
        this.inviteForm.reset();
        this.loadCollaborators();
      },
      error: (err) => {
        if (err.status === 400) this.inviteError = 'No registered user with that email.';
        else if (err.status === 403) this.inviteError = 'Only the build owner can invite collaborators.';
        else this.inviteError = err?.error?.message ?? 'Invite failed.';
      }
    });
  }

  // ── Flight logs ──────────────────────────────────────────────────────
  submitFlightLog(): void {
    if (this.flightLogForm.invalid) return;
    this.flightLogError = '';
    this.flightLogSuccess = '';
    const v = this.flightLogForm.getRawValue();
    this.flightLogService.add(this.buildId, {
      flight_date: v.flight_date,
      location_name: v.location_name,
      duration_min: v.duration_min,
      max_altitude_m: v.max_altitude_m,
      drone_identifier: v.drone_identifier,
      conditions: v.conditions,
      notebook: v.notebook || undefined
    }).subscribe({
      next: () => {
        this.flightLogSuccess = 'Flight log saved.';
        this.flightLogForm.reset({
          flight_date: '',
          location_name: '',
          duration_min: 10,
          max_altitude_m: 50,
          drone_identifier: '',
          conditions: 'SUNNY',
          notebook: ''
        });
        this.loadFlightLogs();
      },
      error: (err) => {
        if (err.status === 400) this.flightLogError = 'Validation error: altitude must be ≤ 120 m and drone id must match XX-XXXXXX (e.g. PL-ABC123).';
        else if (err.status === 403) this.flightLogError = 'Flight logs are only allowed for drone-type builds.';
        else this.flightLogError = err?.error?.message ?? 'Could not save flight log.';
      }
    });
  }
}
