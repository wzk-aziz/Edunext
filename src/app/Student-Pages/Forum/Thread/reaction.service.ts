import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reaction } from '../models/reaction.model';
import { Thread } from '../models/thread.model';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private baseUrl = 'http://localhost:8087/api';
  
  constructor(private http: HttpClient) { }
  
  getAllReactions(): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.baseUrl}/reactions`);
  }
  
  getReactionsByThreadId(threadId: number): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.baseUrl}/threads/${threadId}/reactions`);
  }
  
  getReactionsByBlogId(blogId: number): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.baseUrl}/blogs/${blogId}/reactions`);
  }
  
  getReactionsByStudentEmail(email: string): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.baseUrl}/reactions/student/${email}`);
  }
  
  getReactionById(id: number): Observable<Reaction> {
    return this.http.get<Reaction>(`${this.baseUrl}/reactions/${id}`);
  }
  
  createThreadReaction(threadId: number, reaction: Reaction): Observable<Reaction> {
    return this.http.post<Reaction>(`${this.baseUrl}/threads/${threadId}/reactions`, reaction);
  }
  
  createBlogReaction(blogId: number, reaction: Reaction): Observable<Reaction> {
    return this.http.post<Reaction>(`${this.baseUrl}/blogs/${blogId}/reactions`, reaction);
  }
  
  updateReaction(reaction: Reaction): Observable<Reaction> {
    return this.http.put<Reaction>(`${this.baseUrl}/reactions/${reaction.id}`, reaction);
  }
  
  deleteReaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reactions/${id}`);
  }
}