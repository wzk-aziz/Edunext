import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lecture } from 'src/app/model/Lecture.model';


@Injectable({
  providedIn: 'root'
})
export class LectureService {
  private baseUrl = 'http://localhost:9090/api/lectures';

  constructor(private http: HttpClient) {}

  // Create a new lecture using FormData
  createLecture(formData: FormData): Observable<Lecture> {
    return this.http.post<Lecture>(`${this.baseUrl}/create`, formData);
  }

  // Retrieve all lectures for a given course (sorted by lectureOrder on the backend)
  getLecturesByCourseId(courseId: number): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(`${this.baseUrl}/course/${courseId}`);
  }

  // Retrieve a single lecture by its ID
  getLectureById(lectureId: number): Observable<Lecture> {
    return this.http.get<Lecture>(`${this.baseUrl}/${lectureId}`);
  }

  // Update an existing lecture using FormData
  updateLecture(lectureId: number, formData: FormData): Observable<Lecture> {
    return this.http.put<Lecture>(`${this.baseUrl}/update/${lectureId}`, formData);
  }

  // Delete a lecture; expecting a text response from the backend
  deleteLecture(lectureId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${lectureId}`, { responseType: 'text' });
  }

  // Save user progress (PDF or video)
saveLectureProgress(lectureId: number, type: 'video' | 'pdf', progress: number) {
  return this.http.post(`/api/progress/lecture/${lectureId}`, {
    type,
    progress
  });
}

// Get user progress for all lectures
getAllUserProgress() {
  return this.http.get<{ lectureId: number; videoProgress: number; pdfProgress: number }[]>(
    '/api/progress/all'
  );
}



  
}
