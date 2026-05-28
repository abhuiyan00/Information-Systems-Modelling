import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TestRun, TestRunService } from '../../services/test-run';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-test-runs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './test-runs.html'
})
export class TestRunsComponent implements OnInit {
  private service = inject(TestRunService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  runs: TestRun[] = [];
  loading = true;
  statusFilter = '';
  error = '';
  creating = false;

  form = this.fb.nonNullable.group({
    location_name:    ['', Validators.required],
    city:             ['Wrocław', Validators.required],
    country:          ['PL', Validators.required],
    scheduled_at:     ['', Validators.required],
    latitude:         [51.11],
    longitude:        [17.04],
    weather:          ['SUNNY'],
    max_participants: [10]
  });

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) { this.loading = false; return; }
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.service.list(this.statusFilter || undefined).subscribe({
      next: r => { this.runs = r; this.loading = false; },
      error: () => { this.runs = []; this.loading = false; }
    });
  }

  setStatus(s: string): void { this.statusFilter = s; this.reload(); }
  isLoggedIn(): boolean { return this.auth.isLoggedIn(); }
  toggleCreate(): void { this.creating = !this.creating; this.error = ''; }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const body: Partial<TestRun> = {
      location_name: v.location_name,
      city: v.city,
      country: v.country,
      scheduled_at: new Date(v.scheduled_at).toISOString(),
      latitude: v.latitude,
      longitude: v.longitude,
      weather: v.weather,
      max_participants: v.max_participants
    };
    this.service.create(body).subscribe({
      next: () => { this.creating = false; this.form.reset(); this.reload(); },
      error: e => (this.error = e?.error?.message ?? 'Could not create test run')
    });
  }

  join(id: string): void {
    this.service.join(id).subscribe({ next: () => this.reload() });
  }
}
