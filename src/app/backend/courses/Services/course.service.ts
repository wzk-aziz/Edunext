import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from 'src/app/model/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:8091/api/courses';

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/all`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/get/${id}`);
  }
  
  createCourse(formData: FormData): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/create`, formData);
  }
  
  updateCourse(id: number, formData: FormData): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/update/${id}`, formData);
  }

  deleteCourse(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }
  
  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/get/${id}`);
  }
}
