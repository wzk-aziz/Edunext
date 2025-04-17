import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Session } from '../session/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:9090/api/sessions';

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
          const parsedData = JSON.parse(rawResponse);
          
          // Process instructor data to ensure consistent format - THIS IS THE KEY CHANGE
          // Update the map function in getSessions method with type annotations:
          return parsedData.map((session: any) => {
            // Initialize instructorId
            let instructorId = null;
            
            // Debug what we received
            console.log(`Processing session ${session.idSession}, instructor:`, 
                        session.instructor, 'type:', typeof session.instructor);
            
            // Check if instructor exists
            if (session.instructor !== null && session.instructor !== undefined) {
              if (typeof session.instructor === 'object') {
                // Try all possible ID field names and log what we found
                const possibleId = session.instructor.id || 
                                   session.instructor.idInstructor || 
                                   session.instructor.instructorId;
                
                console.log(`Found instructor object with possible ID: ${possibleId}`);
                instructorId = possibleId;
              } else if (typeof session.instructor === 'number') {
                console.log(`Found direct instructor ID: ${session.instructor}`);
                instructorId = session.instructor;
              } else if (typeof session.instructor === 'string' && !isNaN(Number(session.instructor))) {
                // Handle case where ID is a string number
                console.log(`Found string instructor ID: ${session.instructor}`);
                instructorId = Number(session.instructor);
              }
            }
            
            // Handle case where instructorId is directly present
            if (session.instructorId !== undefined && session.instructorId !== null) {
              console.log(`Using direct instructorId field: ${session.instructorId}`);
              instructorId = session.instructorId;
            }
            
            // Always return with consistent structure
            return {
              ...session,
              instructorId: instructorId,
              // Keep original instructor for reference
              instructor: session.instructor
            };
          });
        } catch (e) {
          console.error('Failed to parse JSON response:', e);
          
          // Try to clean the response before parsing
          const cleanedResponse = this.cleanJsonResponse(rawResponse);
          
          try {
            const parsedData = JSON.parse(cleanedResponse);
            
            // Apply the same instructor transformation to cleaned data
            // Update the map function in getSessions method with type annotations:
            return parsedData.map((session: any) => {
              // Extract instructor ID from various possible formats
              let instructorId = null;
              
              if (session.instructor) {
                if (typeof session.instructor === 'object') {
                  // Try multiple possible property names for the ID
                  instructorId = session.instructor.id || 
                                 session.instructor.idInstructor || 
                                 session.instructor.instructorId;
                  
                  // Replace the instructor object with just the ID
                  return {
                    ...session,
                    instructorId: instructorId, // Add explicit instructorId property
                    instructor: instructorId    // Replace object with just the ID
                  };
                } else if (typeof session.instructor === 'number') {
                  // Already a number, keep it
                  return {
                    ...session,
                    instructorId: session.instructor // Add explicit instructorId property
                  };
                }
              }
              
              return {
                ...session,
                instructorId: instructorId
              };
            });
          } catch (e2) {
            console.error('Failed to parse cleaned JSON:', e2);
            return [];
          }
        }
      }),
      tap(data => {
        console.log('Sessions fetched (parsed):', data.length, 'sessions');
        // Log first item's instructor data to verify
        if (data.length > 0) {
          console.log('First item instructor data:', {
            instructor: data[0].instructor,
            instructorId: data[0].instructorId
          });
        }
      }),
      catchError(error => {
        console.error('Error fetching sessions:', error);
        return of([]);
      })
    );
  }

  // In session.service.ts
  private cleanJsonResponse(rawJson: string): string {
    console.log('Cleaning JSON response...');
    
    // Use the same robust pattern as in feedback service
    let cleaned = rawJson
      .replace(/,"session":\{"idSession":\d+,"session":/g, ',"session":{"idSession":')
      .replace(/,"feedbacks":\[.*?\]/g, '') // Remove feedbacks arrays
      .replace(/,"session":\{[^{}]*\}/g, ',"session":{"idSession":1}') // Replace session objects
      .replace(/,"session":}/g, '}') // Fix dangling session references
      .replace(/\}\]\}\}\]\}\}/g, '}]}]}]'); // Fix unclosed brackets
      
    // Add these additional cleaning steps
    cleaned = cleaned
      .replace(/"session"\s*:\s*\}/g, '"session":{}')
      .replace(/\}\}\]\}\}/g, '}]}]}')
      .replace(/\}\]\}\}/g, '}]}')
      .replace(/\}\}\}/g, '}}');
      
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