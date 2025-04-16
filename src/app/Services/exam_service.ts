import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { exam } from '../models/exam';
import { Question } from '../models/Question';


@Injectable({
    providedIn: 'root'
  })
  export class ExamService {

    private apiUrl = 'http://localhost:8093/api/exams';

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
    const url = `http://localhost:8093/api/exams/questions/${id}`;
    console.log("URL de la requête PUT:", url);
    return this.http.put<Question>(url, question);
  }

  getQuestions(idExam: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idExam}/questions`);
  }
  
  //submitExam(examId: number, answers: { [key: number]: string }): Observable<number> {
    //return this.http.post<number>(`${this.apiUrl}/submit`, { examId, answers });
  //}

  submitExam(submission: any): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/submit`, submission);
  }
  getCertificates(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8093/certificates/${userId}`);
  }
  
  searchExams(title: string): Observable<exam[]> {
    return this.http.get<exam[]>(`http://localhost:8093/api/exams/search?title=${title}`);
  }
  getTop10Certificates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top10`);
  }
  getTop10Exams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top10`).pipe(
      tap((data) => console.log('Données reçues du backend :', data))
    );
  }
  
  getResultsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8093/api/exams/user/${userId}/list`);
  }

  getTotalExamSubmissions(): Observable<any> {
    return this.http.get<number>('http://localhost:8093/api/exams/total-submissions'); 
  }
  gettotalExams(): Observable<any> {
    return this.http.get<number>('http://localhost:8093/api/exams/total'); 
  }
  getcomparaissonscore(): Observable<any> {
    return this.http.get<number>('http://localhost:8093/api/exams/score-comparison'); 
  }
  
}