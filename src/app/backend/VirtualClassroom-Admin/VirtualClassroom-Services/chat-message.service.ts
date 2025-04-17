import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ChatMessage } from '../chat-message/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private apiUrl = 'http://localhost:9090/api/chatMessages';
  
  constructor(private http: HttpClient) { }

  getAllChatMessages(): Observable<ChatMessage[]> {
    console.log('Fetching all chat messages from:', `${this.apiUrl}/all`);
    
    // Use direct fetch to get raw response
    return new Observable<ChatMessage[]>(observer => {
      fetch(`${this.apiUrl}/all`)
        .then(response => response.text())
        .then(text => {
          console.log('Raw response first 100 chars:', text.substring(0, 100) + '...');
          
          try {
            // Try parsing directly first
            const data = JSON.parse(text);
            console.log(`Successfully parsed ${data.length} chat messages`);
            observer.next(data);
            observer.complete();
          } catch (e) {
            console.error('Failed to parse JSON response:', e);
            
            // Try cleaning the JSON
            try {
              const cleanedJson = this.cleanJsonResponse(text);
              const data = JSON.parse(cleanedJson);
              console.log(`Successfully parsed ${data.length} chat messages after cleaning`);
              observer.next(data);
              observer.complete();
            } catch (e2) {
              console.error('Failed to parse cleaned JSON:', e2);
              observer.error(new Error('Failed to parse API response'));
            }
          }
        })
        .catch(error => {
          console.error('Fetch error:', error);
          observer.error(error);
        });
    });
  }

  private cleanJsonResponse(rawJson: string): string {
    console.log('Cleaning JSON response...');
    
    // Fix common circular reference patterns
    let cleaned = rawJson
      .replace(/,"session":\{"idSession":\d+,"session":/g, ',"session":{"idSession":')
      .replace(/,"feedbacks":\[[^\]]*\]/g, '')
      .replace(/,"session":\{[^{}]*\}/g, ',"session":{"idSession":1}')
      .replace(/,"session":}/g, '}')
      .replace(/\}\]\}\}\]\}\}/g, '}]}]}]');
      
    console.log('Cleaned JSON first 100 chars:', cleaned.substring(0, 100) + '...');
    return cleaned;
  }

  getChatMessageById(id: number): Observable<ChatMessage> {
    return this.http.get<ChatMessage>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createChatMessage(chatMessage: ChatMessage): Observable<ChatMessage> {
    // Make sure session is in the correct format
    const payload = {
      contentChatMessage: chatMessage.contentChatMessage,
      session: typeof chatMessage.session === 'number' 
        ? { idSession: chatMessage.session } 
        : chatMessage.session
    };
    
    console.log('Creating message with payload:', payload);
    
    return this.http.post<ChatMessage>(this.apiUrl, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      catchError(error => {
        console.error('Create error details:', error);
        return this.handleError(error);
      })
    );
  }

  updateChatMessage(chatMessage: ChatMessage): Observable<ChatMessage> {
    // Make sure session is in the correct format
    const payload = {
      idChatMessage: chatMessage.idChatMessage,
      contentChatMessage: chatMessage.contentChatMessage,
      session: typeof chatMessage.session === 'number' 
        ? { idSession: chatMessage.session } 
        : chatMessage.session
    };
    
    console.log('Updating with payload:', payload);
    
    return this.http.put<ChatMessage>(`${this.apiUrl}/${chatMessage.idChatMessage}`, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteChatMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('API error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}