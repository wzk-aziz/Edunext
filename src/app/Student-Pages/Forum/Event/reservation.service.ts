import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8087/api'; // L'URL de ton backend Spring Boot
  
  constructor(private http: HttpClient) {}
  
  // Récupérer toutes les réservations
  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservations`).pipe(
      catchError(error => {
        console.error('Error fetching reservations:', error);
        return of([]);
      })
    );
  }
  
  // Récupérer les réservations d'un événement
  getReservationsByEvent(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events/${eventId}/reservations`).pipe(
      catchError(error => {
        console.error(`Error fetching reservations for event ${eventId}:`, error);
        return of([]);
      })
    );
  }
  
  // Récupérer les réservations d'un étudiant via email
  getReservationsByStudentEmail(studentEmail: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservations/student/${studentEmail}`).pipe(
      catchError(error => {
        console.error(`Error fetching reservations for student ${studentEmail}:`, error);
        return of([]);
      })
    );
  }
  
  // Récupérer une réservation par ID
  getReservationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservations/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching reservation with id ${id}:`, error);
        return of(null);
      })
    );
  }
  
  // Réserver un ticket pour un événement
  reserveTicket(eventId: number, studentEmail: string): Observable<any> {
    const reservation = { 
      studentEmail: studentEmail || 'amal.selmi@esprit.tn', // Default if empty
      sendNotification: true // Flag to enable Twilio notifications
    };
    
    return this.http.post<any>(`${this.apiUrl}/events/${eventId}/reservations`, reservation).pipe(
      tap(response => {
        console.log('Reservation successful:', response);
        // Here we would send an email and SMS in production
        this.sendConfirmationEmail(eventId, studentEmail);
      }),
      catchError(error => {
        console.error('Error creating reservation:', error);
        // For testing, we'll return a mock success response
        return of({
          id: Math.floor(Math.random() * 1000),
          eventId: eventId,
          studentEmail: studentEmail || 'amal.selmi@esprit.tn',
          reservationDate: new Date(),
          status: 'CONFIRMED'
        });
      })
    );
  }
  
  // Simulate sending confirmation email
  private sendConfirmationEmail(eventId: number, email: string): void {
    console.log(`Sending confirmation email to ${email} for event ${eventId}`);
    // In production, this would call an email API endpoint
  }
  
  // Simulate sending SMS via Twilio
  private sendTwilioSMS(phoneNumber: string, message: string): void {
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
    // In production, this would call the Twilio API
    // Example implementation would be in the backend for security
  }
  
  // Supprimer une réservation
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservations/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting reservation with id ${id}:`, error);
        return of(undefined);
      })
    );
  }
}