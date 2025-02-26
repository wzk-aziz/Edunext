import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChatMessage } from '../chat-message/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private apiUrl = 'http://localhost:8088/api/chatMessages';
  
  constructor(private http: HttpClient) { }

  getAllChatMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }

  getChatMessageById(id: number): Observable<ChatMessage> {
    return this.http.get<ChatMessage>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createChatMessage(chatMessage: ChatMessage): Observable<ChatMessage> {
    // Simplify for testing - just send what we have
    console.log('Creating message with:', chatMessage);
    
    return this.http.post<ChatMessage>(this.apiUrl, chatMessage).pipe(
      catchError(error => {
        console.error('Create error details:', error);
        return this.handleError(error);
      })
    );
  }

  updateChatMessage(chatMessage: ChatMessage): Observable<ChatMessage> {
    // Transform session to match what backend expects
    const payload = {
      ...chatMessage,
      // Try these options to see which works
      session: typeof chatMessage.session === 'number' 
        ? { idSession: chatMessage.session } 
        : chatMessage.session
    };
    
    console.log('Sending update payload:', JSON.stringify(payload));
    
    return this.http.put<ChatMessage>(`${this.apiUrl}/${chatMessage.idChatMessage}`, payload).pipe(
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
    return throwError(() => new Error(errorMessage));
  }
  
}