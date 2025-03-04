import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProgressReport } from '../progress-report/progress-report.model';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProgressReportService {
  private apiUrl = 'http://localhost:8087/progress-reports';

  constructor(private http: HttpClient) { }

  getAllProgressReports(): Observable<ProgressReport[]> {
    console.log('⏳ Fetching progress reports from:', `${this.apiUrl}/all`);
    
    return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      tap(data => console.log('📦 Raw API response:', data)),
      map(data => {
        if (!Array.isArray(data)) {
          console.warn('⚠️ API did not return an array:', data);
          return [];
        }
        
        return data.map(report => {
          console.log('🔄 Processing report item:', report);
          
          // Extract IDs with fallbacks
          const learnerId = report.learnerId || 
                           (report.learner?.idLearner) || 0;
                           
          const programId = report.mentorshipProgramId || 
                           (report.mentorshipProgram?.idMentorshipProgram) || 0;
          
          // Format date consistently
          let reportDate = new Date();
          if (report.reportDate) {
            try {
              reportDate = new Date(report.reportDate);
            } catch (e) {
              console.error('Date parsing error:', e);
            }
          }
          
          return {
            idReport: report.idReport || 0,
            reportContent: report.reportContent || '',
            reportDate: reportDate,
            learnerId: learnerId,
            mentorshipProgramId: programId,
            learner: report.learner,
            mentorshipProgram: report.mentorshipProgram
          };
        });
      }),
      tap(reports => console.log('✅ Processed reports:', reports)),
      catchError(error => {
        console.error('❌ Error in getAllProgressReports():', error);
        return throwError(() => new Error(`Failed to load progress reports: ${error.message}`));
      })
    );
  }

  getProgressReportById(id: number): Observable<ProgressReport> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(report => ({
        idReport: report.idReport || 0,
        reportContent: report.reportContent || '',
        reportDate: new Date(report.reportDate || new Date()),
        learnerId: report.learnerId || (report.learner?.idLearner) || 0,
        mentorshipProgramId: report.mentorshipProgramId || (report.mentorshipProgram?.idMentorshipProgram) || 0,
        learner: report.learner,
        mentorshipProgram: report.mentorshipProgram
      })),
      catchError(error => {
        console.error(`Failed to fetch report ${id}:`, error);
        return throwError(() => new Error(`Failed to load report: ${error.message}`));
      })
    );
  }

  // In progress-report.service.ts
  createProgressReport(report: Partial<ProgressReport>): Observable<ProgressReport> {
    // Save original IDs for fallback
    const originalLearnerId = report.learnerId;
    const originalProgramId = report.mentorshipProgramId;
    
    // Create backend format with MULTIPLE ID formats
    const backendReport = {
      reportContent: report.reportContent,
      reportDate: this.formatDateForBackend(report.reportDate),
      // Send direct properties
      learnerId: originalLearnerId,
      mentorshipProgramId: originalProgramId,
      // Also send nested objects
      learner: {
        idLearner: originalLearnerId,
        id: originalLearnerId
      },
      mentorshipProgram: {
        idMentorshipProgram: originalProgramId,
        id: originalProgramId
      }
    };
  
    console.log('Sending to backend:', JSON.stringify(backendReport));
  
    return this.http.post<any>(this.apiUrl, backendReport, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      tap(response => console.log('Create response:', response)),
      map(data => ({
        idReport: data.idReport || 0,
        reportContent: data.reportContent || '',
        reportDate: new Date(data.reportDate || new Date()),
        // Use original IDs as fallback
        learnerId: this.extractLearnerId(data, originalLearnerId),
        mentorshipProgramId: this.extractProgramId(data, originalProgramId),
        learner: data.learner,
        mentorshipProgram: data.mentorshipProgram
      })),
      catchError(error => {
        console.error('Failed to create report:', error);
        return throwError(() => new Error(`Failed to create report: ${error.message}`));
      })
    );
  }
  
  // Helper method to extract learner ID
  private extractLearnerId(data: any, fallbackId: number | undefined): number {
    if (data.learnerId !== undefined && data.learnerId !== null) {
      return Number(data.learnerId);
    }
    
    if (data.learner) {
      if (typeof data.learner === 'object') {
        if (data.learner.idLearner !== undefined) {
          return Number(data.learner.idLearner);
        }
        if (data.learner.id !== undefined) {
          return Number(data.learner.id);
        }
      }
    }
    
    return fallbackId || 0;
  }
  
  // Helper method to extract program ID
  private extractProgramId(data: any, fallbackId: number | undefined): number {
    if (data.mentorshipProgramId !== undefined && data.mentorshipProgramId !== null) {
      return Number(data.mentorshipProgramId);
    }
    
    if (data.mentorshipProgram) {
      if (typeof data.mentorshipProgram === 'object') {
        if (data.mentorshipProgram.idMentorshipProgram !== undefined) {
          return Number(data.mentorshipProgram.idMentorshipProgram);
        }
        if (data.mentorshipProgram.id !== undefined) {
          return Number(data.mentorshipProgram.id);
        }
      }
    }
    
    return fallbackId || 0;
  }

  updateProgressReport(report: ProgressReport): Observable<ProgressReport> {
    // Save original IDs for fallback
    const originalLearnerId = report.learnerId;
    const originalProgramId = report.mentorshipProgramId;
    
    // Create backend format with MULTIPLE ID formats
    const backendReport = {
      idReport: report.idReport,
      reportContent: report.reportContent,
      reportDate: this.formatDateForBackend(report.reportDate),
      // Send direct properties
      learnerId: originalLearnerId,
      mentorshipProgramId: originalProgramId,
      // Also send nested objects
      learner: {
        idLearner: originalLearnerId,
        id: originalLearnerId
      },
      mentorshipProgram: {
        idMentorshipProgram: originalProgramId,
        id: originalProgramId
      }
    };
  
    console.log('Updating with:', JSON.stringify(backendReport));
  
    return this.http.put<any>(`${this.apiUrl}/${report.idReport}`, backendReport, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      tap(response => console.log('Update response:', response)),
      map(data => ({
        idReport: data.idReport || report.idReport,
        reportContent: data.reportContent || report.reportContent,
        reportDate: new Date(data.reportDate || report.reportDate),
        // Use original IDs as fallback
        learnerId: this.extractLearnerId(data, originalLearnerId),
        mentorshipProgramId: this.extractProgramId(data, originalProgramId),
        learner: data.learner,
        mentorshipProgram: data.mentorshipProgram
      })),
      catchError(error => {
        console.error('Failed to update report:', error);
        return throwError(() => new Error(`Failed to update report: ${error.message}`));
      })
    );
  }

  deleteProgressReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Report ${id} deleted successfully`)),
      catchError(error => {
        console.error(`Failed to delete report ${id}:`, error);
        return throwError(() => new Error(`Failed to delete report: ${error.message}`));
      })
    );
  }

  private formatDateForBackend(date: Date | string | undefined): string {
    if (!date) return new Date().toISOString();
    
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString();
  }
}