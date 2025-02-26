import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgressReport } from './progress-report.model';
import { environment } from '../../../environements/environements';

@Injectable({
  providedIn: 'root'
})
export class ProgressReportService {
  private apiUrl = `http://localhost:8087/api/progressReports`; // Use the apiUrl from environment

  constructor(private http: HttpClient) {}

  getProgressReports(): Observable<ProgressReport[]> {
    return this.http.get<ProgressReport[]>(`${this.apiUrl}/all`);
  }

  addProgressReport(report: ProgressReport): Observable<ProgressReport> {
    return this.http.post<ProgressReport>(this.apiUrl, report);
  }

  editProgressReport(report: ProgressReport): Observable<ProgressReport> {
    return this.http.put<ProgressReport>(`${this.apiUrl}/${report.id_report}`, report);
  }

  deleteProgressReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}