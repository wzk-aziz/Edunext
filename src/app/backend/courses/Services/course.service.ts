import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from 'src/app/model/course.model'
@Injectable({
  providedIn: 'root'
})
export class CourseService {
 private baseUrl = 'http://localhost:8091/api/courses';

  constructor(private http: HttpClient) { }



  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/all`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }
  
  
  createCourse(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, formData);
  }
  
  
  
  updateCourse(id: number, formData:FormData): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${id}`, formData);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadFile(courseId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<string>(`${this.baseUrl}/upload/${courseId}`, formData);
  }
  


}
