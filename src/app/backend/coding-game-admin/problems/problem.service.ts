import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Problem } from '../models/problem.model';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private apiUrl = `${environment.apiUrl}/problems`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Problem[]> {
    return this.http.get<Problem[]>(this.apiUrl);
  }
  getProblemPDF(problemId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/problems/${problemId}/pdf`, {
      responseType: 'blob'
    });
  }
  getById(id: number): Observable<Problem> {
    return this.http.get<Problem>(`${this.apiUrl}/${id}`);
  }

  create(problem: Problem): Observable<Problem> {
    return this.http.post<Problem>(this.apiUrl, problem);
  }

  update(id: number, problem: Problem): Observable<Problem> {
    return this.http.put<Problem>(`${this.apiUrl}/${id}`, problem);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
