import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Thread } from '../models/thread.model';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  private baseUrl = 'http://localhost:9090/api/thread';

  constructor(private http: HttpClient) { }


  getAllThreads(): Observable<Thread[]> {
    return this.http.get<Thread[]>(`${this.baseUrl}/threads`);
  }

  getThreadsByForumId(forumId: number): Observable<Thread[]> {
    return this.http.get<Thread[]>(`${this.baseUrl}/forums/${forumId}/threads`);
  }

  getThreadById(id: number): Observable<Thread> {
    return this.http.get<Thread>(`${this.baseUrl}/threads/${id}`);
  }

  createThread(thread: Thread, forumId: number): Observable<Thread> {
    return this.http.post<Thread>(`${this.baseUrl}/forums/${forumId}/threads`, thread);
  }

  updateThread(thread: Thread): Observable<Thread> {
    return this.http.put<Thread>(`${this.baseUrl}/threads/${thread.id}`, thread);
  }

  deleteThread(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/threads/${id}`);
  }
}