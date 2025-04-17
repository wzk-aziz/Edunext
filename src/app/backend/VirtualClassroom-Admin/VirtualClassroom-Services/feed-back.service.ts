
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Feedback } from '../feed-back/feed-back.model';

@Injectable({
  providedIn: 'root'
})
export class FeedBackService {
  private apiUrl = 'http://localhost:9090/api/feedbacks';

  constructor(private http: HttpClient) {}

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get(`${this.apiUrl}/all`, { 
      responseType: 'text',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(rawResponse => {
        console.log('Raw feedback response:', rawResponse.substring(0, 100) + '...');
        try {
          return JSON.parse(rawResponse);
        } catch (e) {
          console.error('Failed to parse feedback JSON:', e);
          
          // Try to clean the response before parsing
          const cleaned = this.cleanJsonResponse(rawResponse);
          try {
            return JSON.parse(cleaned);
          } catch (e2) {
            console.error('Failed to parse cleaned feedback JSON:', e2);
            return [];
          }
        }
      }),
      tap(data => console.log('Feedbacks fetched:', data)),
      catchError(error => {
        console.error('Error fetching feedbacks:', error);
        return of([]);
      })
    );
  }

  getFeedback(id: number): Observable<Feedback> {
    return this.http.get<Feedback>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createFeedback(feedback: Feedback): Observable<Feedback> {
    // Properly format feedback for API
    const payload = {
      contentFeedback: feedback.contentFeedback,
      rating: feedback.rating,
      session: typeof feedback.session === 'number' 
        ? { idSession: feedback.session } 
        : feedback.session
    };
  
    console.log('Creating feedback with payload:', payload);
  
    // Changed from ${this.apiUrl}/add to just ${this.apiUrl}
    return this.http.post<Feedback>(`${this.apiUrl}`, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      tap(data => console.log('Feedback created:', data)),
      catchError(this.handleError)
    );
  }

  updateFeedback(feedback: Feedback): Observable<Feedback> {
    // Properly format feedback for API
    const payload = {
      idFeedback: feedback.idFeedback,
      contentFeedback: feedback.contentFeedback,
      rating: feedback.rating,
      session: typeof feedback.session === 'number' 
        ? { idSession: feedback.session } 
        : feedback.session
    };

    console.log('Updating feedback with payload:', payload);
    
    return this.http.put<Feedback>(`${this.apiUrl}/${feedback.idFeedback}`, payload).pipe(
      tap(data => console.log('Feedback updated:', data)),
      catchError(this.handleError)
    );
  }

  deleteFeedback(id: number|undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Deleted feedback ID:', id)),
      catchError(this.handleError)
    );
  }

  private cleanJsonResponse(rawJson: string): string {
    console.log('Cleaning JSON response...');
    
    // Fix common circular reference patterns
    let cleaned = rawJson
      .replace(/,"session":\{"idSession":\d+,"session":/g, ',"session":{"idSession":')
      .replace(/,"feedbacks":\[.*?\]/g, '') // Remove feedbacks arrays
      .replace(/,"session":\{[^{}]*\}/g, ',"session":{"idSession":1}') // Replace session objects
      .replace(/,"session":}/g, '}') // Fix dangling session references
      .replace(/\}\]\}\}\]\}\}/g, '}]}]}]'); // Fix unclosed brackets
    
    console.log('Cleaned JSON first 100 chars:', cleaned.substring(0, 100) + '...');
    return cleaned;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error) {
        try {
          const errorDetail = typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
          errorMessage += `\nDetails: ${errorDetail}`;
        } catch (e) {
          errorMessage += '\nUnable to extract error details';
        }
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}