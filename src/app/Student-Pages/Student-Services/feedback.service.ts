import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Update your SessionFeedback interface to include UI-specific properties
export interface SessionFeedback {
  // Database properties
  idFeedback: number;
  contentFeedback: string;
  rating: number;
  sessionId?: number;
  
  // UI-specific properties (add these)
  id?: number;             // Add this for compatibility
  comments?: string;       // Alias for contentFeedback
  strengths?: string[];
  improvements?: string[];
  dateSubmitted?: string;
  instructorId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:9090/api/feedbacks';
  
  constructor(private http: HttpClient) { }
  
  // Update the getSessionFeedback method to try more endpoint formats
  
  getSessionFeedback(sessionId: number): Observable<SessionFeedback | null> {
    console.log(`Fetching feedback for session ID: ${sessionId}`);
    
    // Try with the actual idFeedback as the path parameter
    return this.http.get<any>(`${this.apiUrl}/${sessionId}`).pipe(
      map(response => {
        console.log('Feedback API response:', response);
        
        if (!response) {
          console.warn('Received null response from API');
          return null;
        }
        
        // Process response...
        return this.mapFeedbackResponse(response, sessionId);
      }),
      catchError(error => {
        console.error(`Error with primary endpoint:`, error);
        
        // Now try with API pattern: bySession/{id}
        return this.http.get<any>(`${this.apiUrl}/bySession/${sessionId}`).pipe(
          map(response => {
            console.log('bySession endpoint response:', response);
            return this.mapFeedbackResponse(response, sessionId);
          }),
          catchError(error => {
            console.error('bySession endpoint failed:', error);
            
            // Try with ?sessionId={id} query parameter
            return this.http.get<any>(`${this.apiUrl}?sessionId=${sessionId}`).pipe(
              map(response => {
                console.log('Query parameter endpoint response:', response);
                return this.mapFeedbackResponse(response, sessionId);
              }),
              catchError(() => {
                // One final attempt with session_id (snake case)
                return this.http.get<any>(`${this.apiUrl}?session_id=${sessionId}`).pipe(
                  map(response => {
                    console.log('Snake case query parameter response:', response);
                    return this.mapFeedbackResponse(response, sessionId);
                  }),
                  catchError(() => of(null))
                );
              })
            );
          })
        );
      })
    );
  }
  
  // Helper method to map backend response to frontend model
  private mapFeedbackResponse(response: any, sessionId: number): SessionFeedback {
    // This handles the mismatch between backend and frontend fields
    return {
      idFeedback: response.idFeedback,
      contentFeedback: response.contentFeedback,
      rating: response.rating,
      sessionId: sessionId,
      
      // Map the fields your UI expects - this creates a compatible model
      id: response.idFeedback,
      comments: response.contentFeedback,
      strengths: [],  // Not in your database
      improvements: [], // Not in your database
      dateSubmitted: new Date().toISOString() // Not in your database
    };
  }
  
  // Try alternative API endpoint patterns
  private tryAlternativeEndpoint(sessionId: number): Observable<SessionFeedback | null> {
    console.log('Trying alternative feedback endpoint');
    
    // Try a different endpoint structure
    return this.http.get<SessionFeedback>(`${this.apiUrl}/${sessionId}`).pipe(
      map(response => {
        console.log('Alternative endpoint response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Alternative endpoint error:', error);
        return of(this.getMockFeedback(sessionId));
      })
    );
  }
  
  private getMockFeedback(sessionId: number): SessionFeedback {
    console.log('Using mock feedback data for session', sessionId);
    return {
      // Required database properties
      idFeedback: 100 + sessionId,
      contentFeedback: "This session was very informative and engaging. The instructor explained complex concepts clearly and provided practical examples.",
      rating: 4.5,
      sessionId: sessionId,
      
      // UI-specific properties
      id: 100 + sessionId,
      instructorId: 1,
      comments: "This session was very informative and engaging. The instructor explained complex concepts clearly and provided practical examples.",
      strengths: [
        "Clear explanations",
        "Interactive demonstrations",
        "Well-structured content",
        "Answered questions thoroughly"
      ],
      improvements: [
        "Could provide more practice exercises",
        "Additional resources would be helpful"
      ],
      dateSubmitted: new Date().toISOString()
    };
  }


  



}