import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  createEvent(eventData: any): Observable<any> {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.forumApiUrl}/api/events`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
  getEventById(id: string): Observable<Event> {  // ✅ Change 'number' en 'string'
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
}

  reserveTicket(eventId: number, studentEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/reservations`, { studentEmail });
  }
  
  

}
