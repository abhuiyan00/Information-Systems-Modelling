import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student';
import { StudentPayload } from '../../../models/student';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './student-form.html'
})
export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  studentId?: number;

  // ✅ strongly typed form
  form = this.fb.nonNullable.group({
    id: [0],
    name: ['', Validators.required],
    birthDay: ['', Validators.required]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.studentId = Number(id);

      this.service.getById(this.studentId).subscribe(student => {
        this.form.patchValue({
          name: student.name,
          birthDay: student.birthDay
        });
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    // ✅ FIX: correct type (NO Student type used here)
    const data: StudentPayload = this.form.getRawValue();

    if (this.studentId) {
      this.service.update(this.studentId, data).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.service.create(data).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
