import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8087/api'; // L'URL de ton backend Spring Boot

  constructor(private http: HttpClient) {}

  // Récupérer toutes les réservations
  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservations`);
  }

  // Récupérer les réservations d'un événement
  getReservationsByEvent(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events/${eventId}/reservations`);
  }

  // Récupérer les réservations d'un étudiant via email
  getReservationsByStudentEmail(studentEmail: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservations/student/${studentEmail}`);
  }

  // Récupérer une réservation par ID
  getReservationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservations/${id}`);
  }

  // Réserver un ticket pour un événement
  reserveTicket(eventId: number, studentEmail: string): Observable<any> {
    const reservation = { studentEmail: studentEmail }; // Le format du body
    return this.http.post<any>(`${this.apiUrl}/events/${eventId}/reservations`, reservation);
  
  }
  
  // Supprimer une réservation
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservations/${id}`);
  }
}
