import { Routes } from '@angular/router';
import { StudentListComponent } from './features/students/student-list/student-list';
import { StudentFormComponent } from './features/students/student-form/student-form';

export const routes: Routes = [
  { path: '', component: StudentListComponent },
  { path: 'create', component: StudentFormComponent },
  { path: 'edit/:id', component: StudentFormComponent }
];
