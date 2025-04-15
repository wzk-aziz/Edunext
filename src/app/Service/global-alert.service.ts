import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/** A simple interface for our custom alert. */
export interface AlertData {
  title?: string;        // e.g. "Error", "Warning", etc.
  message: string;       // The main text
  isConfirm?: boolean;   // If true, show OK/Cancel instead of just OK
  onConfirm?: () => void; // Callback if user confirms
  onCancel?: () => void;  // Callback if user cancels
}

@Injectable({
  providedIn: 'root'
})
export class GlobalAlertService {
  private alertSubject = new Subject<AlertData>();

  /** An observable so that our component can listen for alerts. */
  get alert$(): Observable<AlertData> {
    return this.alertSubject.asObservable();
  }

  /**
   * Show a simple alert (OK button only).
   * @param message The text to display
   * @param title Optional title
   */
  showAlert(message: string, title?: string): void {
    this.alertSubject.next({ message, title, isConfirm: false });
  }

  /**
   * Show a confirm dialog (OK + Cancel buttons).
   * @param message The text to display
   * @param onConfirm Callback if user confirms
   * @param onCancel Callback if user cancels
   * @param title Optional title
   */
  showConfirm(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title?: string
  ): void {
    this.alertSubject.next({
      message,
      title,
      isConfirm: true,
      onConfirm,
      onCancel
    });
  }
}
