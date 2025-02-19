import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { exam } from '../models/exam';
import { Question } from '../models/Question';
@Injectable({
    providedIn: 'root'
  })
  export class ExamService {
    private apiUrl = 'http://localhost:9090/api/exams';
    constructor(private http: HttpClient) {}

  getAllExams(): Observable<exam[]> {
    return this.http.get<exam[]>(this.apiUrl);
  }

  getExamById(idExam: number): Observable<exam> {
    return this.http.get<exam>(`${this.apiUrl}/${idExam}`);
  }

  createExam(exam: exam): Observable<exam> {
    return this.http.post<exam>(this.apiUrl, exam);
  }

  updateExam(idExam: number, exam: exam): Observable<exam> {
    return this.http.put<exam>(`${this.apiUrl}/${idExam}`, exam);
  }

  deleteExam(idExam: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idExam}`);
  }
  addQuestion(idExam: number, question: Question): Observable<exam> {
    return this.http.post<exam>(`${this.apiUrl}/${idExam}/questions`, question);
  }
  updateQuestion(id: number, question: Question): Observable<Question> {
    const url = `http://localhost:9090/api/exams/questions/${id}`;
    console.log("URL de la requête PUT:", url);
    return this.http.put<Question>(url, question);
  }
  
}