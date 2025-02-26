import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environements';
import { Observable } from 'rxjs';
import { ChatMessage } from './chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private apiUrl = `http://localhost:8088/api/chatMessages`; // Use the apiUrl from environment

  constructor(private http: HttpClient) {}

  getChatMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/all`);
  }


  createChatMessage(chatMessage: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(this.apiUrl, chatMessage);
  }

  updateChatMessage(chatMessage: ChatMessage): Observable<ChatMessage> {
    return this.http.put<ChatMessage>(`${this.apiUrl}/${chatMessage.id_chat_message}`, chatMessage);
  }

  deleteChatMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}