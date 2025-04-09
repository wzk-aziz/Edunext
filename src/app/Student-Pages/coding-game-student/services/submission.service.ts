import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Submission } from '../models/submission.model';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = 'http://localhost:8088/submissions';

  constructor(private http: HttpClient) {}

  submit(submission: Submission): Observable<Submission> {
    return this.http.post<Submission>(`${this.apiUrl}/submit`, submission)
      .pipe(catchError(this.handleError<Submission>('submit')));
  }

  getByUser(userId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.apiUrl}/user/${userId}`)
      .pipe(catchError(this.handleError<Submission[]>('getByUser', [])));
  }

  getSubmissionsPerProblem(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stats/by-problem`)
      .pipe(catchError(this.handleError<any[]>('getSubmissionsPerProblem', [])));
  }

  getBestScoresPerStudent(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stats/best-scores`)
      .pipe(catchError(this.handleError<any[]>('getBestScoresPerStudent', [])));
  }

  getAllSubmissionsSorted(): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.apiUrl}/stats/all-sorted`)
      .pipe(catchError(this.handleError<Submission[]>('getAllSubmissionsSorted', [])));
  }

  // Helper method to handle HTTP errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}