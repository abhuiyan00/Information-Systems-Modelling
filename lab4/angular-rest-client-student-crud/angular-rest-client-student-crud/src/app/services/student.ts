import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, StudentPayload } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8080/universityService01/students';

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.api);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.api}/${id}`);
  }

  create(student: StudentPayload): Observable<Student> {
    return this.http.post<Student>(this.api, student);
  }

  update(id: number, student: StudentPayload): Observable<Student> {
    return this.http.put<Student>(`${this.api}/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
