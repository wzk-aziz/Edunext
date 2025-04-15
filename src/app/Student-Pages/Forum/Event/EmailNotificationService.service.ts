import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailNotificationService {
  private apiUrl = `${environment.forumApiUrl}/api/email`;

  constructor(private http: HttpClient) {}

  /**
   * Send reservation confirmation email
   * @param eventId - ID of the event
   * @param studentEmail - Email of the student reserving the ticket
   * @returns Observable with email sending result
   */
  sendReservationConfirmation(eventId: number, studentEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-reservation`, {
      eventId,
      studentEmail,
      subject: 'Confirmation de réservation pour l\'événement',
      template: 'reservation-confirmation'
    });
  }

  /**
   * Send generic notification email
   * @param recipient - Email address of the recipient
   * @param subject - Email subject
   * @param message - Email body message
   * @returns Observable with email sending result
   */
  sendNotificationEmail(recipient: string, subject: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-notification`, {
      recipient,
      subject,
      message
    });
  }
}