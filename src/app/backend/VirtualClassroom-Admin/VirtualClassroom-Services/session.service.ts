import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Session } from '../session/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:8088/api/sessions';

  constructor(private http: HttpClient) {}

  getSessions(): Observable<Session[]> {
    console.log('Fetching sessions from:', `${this.apiUrl}/all`);
    
    // Use responseType 'text' to handle circular reference issues in JSON
    return this.http.get(`${this.apiUrl}/all`, { 
      responseType: 'text',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      map(rawResponse => {
        console.log('Raw response first 100 chars:', rawResponse.substring(0, 100) + '...');
        try {
          // First attempt to parse as-is
          return JSON.parse(rawResponse);
        } catch (e) {
          console.error('Failed to parse JSON response:', e);
          
          // Try to clean the response before parsing
          const cleanedResponse = this.cleanJsonResponse(rawResponse);
          
          try {
            return JSON.parse(cleanedResponse);
          } catch (e2) {
            console.error('Failed to parse cleaned JSON:', e2);
            return [];
          }
        }
      }),
      tap(data => console.log('Sessions fetched (parsed):', data.length, 'sessions')),
      catchError(error => {
        console.error('Error fetching sessions:', error);
        return of([]);
      })
    );
  }

  // Helper method to clean circular JSON references
  private cleanJsonResponse(rawJson: string): string {
    console.log('Cleaning JSON response...');
    
    // Fix common circular reference patterns
    let cleaned = rawJson
      .replace(/,"feedbacks":\[.*?\]/g, '') // Remove feedbacks arrays
      .replace(/,"session":\{[^{}]*\}/g, '') // Remove session objects
      .replace(/,"session":}/g, '}') // Fix dangling session references
      .replace(/\}\]\}\}\]\}\}/g, '}]}]}]'); // Fix unclosed brackets
    
    console.log('Cleaned JSON first 100 chars:', cleaned.substring(0, 100) + '...');
    return cleaned;
  }

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
}