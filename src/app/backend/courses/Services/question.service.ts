import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from 'src/app/model/question.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'http://localhost:9090/api/questions';

  constructor(private http: HttpClient) {}

  getQuestionsByQuizId(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/quiz/${quizId}`);
  }

  getQuestionById(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.baseUrl}/${id}`);
  }

  createQuestionsForQuiz(quizId: number, questions: Question[]): Observable<Question[]> {
    // Ensure each question object includes the quizId
    const payload = questions.map(q => ({ ...q, quizId }));
    return this.http.post<Question[]>(`${this.baseUrl}/create`, payload);
  }
  

  updateQuestion(id: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.baseUrl}/update/${id}`, question);
  }

  deleteQuestion(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }
}
