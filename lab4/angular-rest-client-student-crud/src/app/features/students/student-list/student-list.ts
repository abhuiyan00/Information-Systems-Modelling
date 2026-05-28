import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../services/student';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.scss'
})
export class StudentListComponent {
  private service = inject(StudentService);

  students$ = this.service.getAll();

  refresh() {
    this.students$ = this.service.getAll();
  }

  delete(id: number) {
    if (!confirm('Delete this student?')) return;

    this.service.delete(id).subscribe(() => {
      this.students$ = this.service.getAll();
    });
  }
}
