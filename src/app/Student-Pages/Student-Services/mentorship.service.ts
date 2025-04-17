import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MentorshipProgram } from 'src/app/Student-Pages/student-tutoring/student-tutoring.model';

@Injectable({
  providedIn: 'root'
})
export class MentorshipService {
  private apiUrl = 'http://localhost:9090/mentorship-programs';

  constructor(private http: HttpClient) { }

  getMentorshipPrograms(): Observable<MentorshipProgram[]> {
    return this.http.get<MentorshipProgram[]>(`${this.apiUrl}/all`);
  }

  getMentorshipProgramById(id: number): Observable<MentorshipProgram> {
    return this.http.get<MentorshipProgram>(`${this.apiUrl}/${id}`);
  }
}