import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MentorshipProgram } from './mentorship-program.model';
import { environment } from '../../../environements/environements';

@Injectable({
  providedIn: 'root'
})
export class MentorshipProgramService {
  private apiUrl = `http://localhost:8087/api/mentorshipPrograms`; // Use the apiUrl from environment

  constructor(private http: HttpClient) {}

  getMentorshipPrograms(): Observable<MentorshipProgram[]> {
    return this.http.get<MentorshipProgram[]>(`${this.apiUrl}/all`);
  }

  addMentorshipProgram(program: MentorshipProgram): Observable<MentorshipProgram> {
    return this.http.post<MentorshipProgram>(this.apiUrl, program);
  }

  editMentorshipProgram(program: MentorshipProgram): Observable<MentorshipProgram> {
    return this.http.put<MentorshipProgram>(`${this.apiUrl}/${program.id_mentorship_program}`, program);
  }

  deleteMentorshipProgram(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}