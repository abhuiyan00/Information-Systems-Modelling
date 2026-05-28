import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BuildService } from '../../../services/build';
import { BuildPayload, BuildType } from '../../../models/build';

@Component({
  selector: 'app-build-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './build-form.html'
})
export class BuildFormComponent implements OnInit {
  private buildService = inject(BuildService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  buildId?: string;
  error = '';

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    type: ['drone' as BuildType, Validators.required],
    description: [''],
    scale: [''],
    wingspan_mm: [null as number | null],
    frame_size_mm: [null as number | null],
    num_motors: [null as number | null],
    flight_controller: [''],
    max_takeoff_weight_g: [null as number | null],
    rotor_diameter_mm: [null as number | null],
    hull_length_mm: [null as number | null],
    wheelbase_mm: [null as number | null]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.buildId = id;
      this.buildService.getById(id).subscribe(build => {
        this.form.patchValue({
          title: build.title,
          type: build.type,
          description: build.description ?? '',
          scale: build.scale ?? '',
          wingspan_mm: build.wingspan_mm ?? null,
          frame_size_mm: build.frame_size_mm ?? null,
          num_motors: build.num_motors ?? null,
          flight_controller: build.flight_controller ?? '',
          max_takeoff_weight_g: build.max_takeoff_weight_g ?? null,
          rotor_diameter_mm: build.rotor_diameter_mm ?? null,
          hull_length_mm: build.hull_length_mm ?? null,
          wheelbase_mm: build.wheelbase_mm ?? null
        });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const payload: BuildPayload = {
      title: v.title,
      type: v.type,
      description: v.description || undefined,
      scale: v.scale || undefined,
      wingspan_mm: v.wingspan_mm ?? undefined,
      frame_size_mm: v.frame_size_mm ?? undefined,
      num_motors: v.num_motors ?? undefined,
      flight_controller: v.flight_controller || undefined,
      max_takeoff_weight_g: v.max_takeoff_weight_g ?? undefined,
      rotor_diameter_mm: v.rotor_diameter_mm ?? undefined,
      hull_length_mm: v.hull_length_mm ?? undefined,
      wheelbase_mm: v.wheelbase_mm ?? undefined
    };

    const obs = this.buildId
      ? this.buildService.update(this.buildId, payload)
      : this.buildService.create(payload);

    obs.subscribe({
      next: () => this.router.navigate(['/builds']),
      error: (err) => (this.error = err?.error?.message ?? 'Could not save build')
    });
  }
}
