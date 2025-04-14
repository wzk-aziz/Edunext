import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private apiUrl = 'GET /whatishere.php?lat=48.8719556&lng=2.3415407&lang=en&country=us HTTP/1.1';
  private apiKey = '58ed86b64fmsh66a4bf39c5ccddep162a57jsne4e639de074e';

  constructor(private http: HttpClient) {}

  getLocation(address: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': 'google-api31.p.rapidapi.com',
      'Content-Type': 'application/json'
    });

    const body = {
      text: address,
      place: address,
      street: '',
      city: '',
      country: '',
      state: '',
      postalcode: '',
      latitude: '',
      longitude: '',
      radius: ''
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
  getReservationsByEvent(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events/${eventId}/reservations`);
  }

  reserveTicket(eventId: number, email: string): Observable<any> {
    // Create a proper reservation object as expected by the backend
    const reservation = {
      studentEmail: email,
      reservationDate: new Date()
    };
    
    return this.http.post<any>(`${this.apiUrl}/events/${eventId}/reservations`, reservation);
  }
}
