import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CourseLevel, PackType } from 'src/app/model/course.model';
import { UserCourseDashboardDto } from 'src/app/model/UserCourseDashboardDto.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:9090/api/courses';

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

  // New search endpoints
  getCoursesByName(name: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/search/by-name?name=${name}`);
  }

  getCoursesByCategory(categoryId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/search/by-category?categoryId=${categoryId}`);
  }

  getCoursesByCourseLevel(courseLevel: CourseLevel): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/search/by-course-level?courseLevel=${courseLevel}`);
  }

  getCoursesByPackType(packType: PackType): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/search/by-pack-type?packType=${packType}`);
  }

 

  voteCourse(courseId: number, vote: 'like' | 'dislike'): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/${courseId}/vote?vote=${vote}`, {});
  }
  
  getUserCourses(): Observable<UserCourseDashboardDto[]> {
    return this.http.get<UserCourseDashboardDto[]>('/api/user-dashboard/courses');
  }
  
  
}
