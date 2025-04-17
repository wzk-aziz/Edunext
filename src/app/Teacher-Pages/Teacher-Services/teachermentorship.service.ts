import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MentorshipProgram } from '../../Student-Pages/student-tutoring/student-tutoring.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherMentorshipService {
  private apiUrl = 'http://localhost:9090/mentorship-programs';
  
  // HTTP Options with headers
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Add auth headers if needed
      // 'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };

  constructor(private http: HttpClient) { }

  // Get all mentorship programs with better error handling
  getMentorshipPrograms(): Observable<MentorshipProgram[]> {
    return this.http.get<MentorshipProgram[]>(`${this.apiUrl}/all`).pipe(
      tap(data => console.log('Fetched programs:', data)),
      catchError(this.handleError)
    );
  }

  // Get a specific mentorship program
  getMentorshipProgramById(id: number): Observable<MentorshipProgram> {
    return this.http.get<MentorshipProgram>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  // Create a new mentorship program
  createMentorshipProgram(programData: Partial<MentorshipProgram>): Observable<MentorshipProgram> {
    console.log('Creating program with data:', programData);
    // Remove "/add" to match the session pattern that works
    return this.http.post<MentorshipProgram>(
      `${this.apiUrl}`, 
      programData, 
      this.httpOptions
    ).pipe(
      tap(data => console.log('Created program:', data)),
      catchError(this.handleError)
    );
  }
  

// Update an existing mentorship program - MODIFIED
updateMentorshipProgram(id: number, programData: Partial<MentorshipProgram>): Observable<MentorshipProgram> {
  console.log(`Updating program ${id} with data:`, programData);
  // Remove "/update/" to match the session pattern that works
  return this.http.put<MentorshipProgram>(
    `${this.apiUrl}/${id}`, 
    programData, 
    this.httpOptions
  ).pipe(
    tap(data => console.log('Updated program:', data)),
    catchError(this.handleError)
  );
}
  
deleteMentorshipProgram(id: number): Observable<any> {
  console.log(`Deleting program ${id}`);
  // Remove "/delete/" to match the session pattern that works
  return this.http.delete(
    `${this.apiUrl}/${id}`,
    this.httpOptions
  ).pipe(
    tap(() => console.log(`Deleted program ${id}`)),
    catchError(this.handleError)
  );
}
  
  // Error handler
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      if (error.error && typeof error.error === 'object') {
        console.error('API Error Response:', error.error);
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}