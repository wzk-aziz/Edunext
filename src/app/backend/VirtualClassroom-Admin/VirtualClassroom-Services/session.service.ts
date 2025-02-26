import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { Session } from '../session/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:8088/api/sessions';

  constructor(private http: HttpClient) {}



  getSession(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addSession(session: any): Observable<Session> {
    // Don't modify the original object
    const sessionData = { ...session };
    
    // Make sure we only include the fields the API expects
    const payload = {
      titleSession: sessionData.titleSession,
      sessionDuration: sessionData.sessionDuration || 0,
      startTime: sessionData.startTime,
      sessionSubject: sessionData.sessionSubject,
      instructor: sessionData.instructor || null
    };
    
    console.log('Sending session data to API:', JSON.stringify(payload));
    
    return this.http.post<Session>(this.apiUrl, payload).pipe(
      tap(data => console.log('Added session response:', data)),
      catchError((error) => {
        console.error('Add session error details:', error);
        return this.handleError(error);
      })
    );
  }

  updateSession(session: Session): Observable<Session> {
    const sessionData = { ...session };
    
    // Convert the date to ISO string if it's a Date object
    if (sessionData.startTime instanceof Date) {
      sessionData.startTime = sessionData.startTime.toISOString();
    }
    
    return this.http.put<Session>(`${this.apiUrl}/${session.idSession}`, sessionData).pipe(
      tap(data => console.log('Updated session response:', data)),
      catchError(this.handleError)
    );
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
      
      if (error.status === 0) {
        errorMessage += '\nPossible CORS issue or server is not running';
      }
      
      if (error.error) {
        errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
      }
    }
    console.error('HTTP Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }


  getSessions(): Observable<Session[]> {
    console.log('Calling API:', `${this.apiUrl}/all`);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    // Try first with /all endpoint
    return this.http.get<Session[]>(`${this.apiUrl}/all`, { headers })
      .pipe(
        tap(data => {
          if (data) {
            console.log('Received data:', data);
            console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
          } else {
            console.log('Received empty or null response');
          }
        }),
        catchError((error) => {
          console.error('Error with /all endpoint:', error);
          
          // If first endpoint fails, try without /all
          console.log('Trying alternative endpoint without /all');
          return this.http.get<Session[]>(this.apiUrl, { headers }).pipe(
            tap(data => console.log('Alternative endpoint data:', data)),
            catchError(this.handleError)
          );
        }),
        finalize(() => console.log('API call completed'))
      );
  }
}