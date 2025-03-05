import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// 1. Update the interface to match exactly your backend entity
export interface TeacherClassroomSession {
  idSession: number;
  titleSession: string;
  sessionSubject: string;
  startTime: Date;
  sessionDuration: number;
  instructor_id: number;  // Change this to match database column name
  
  // Frontend-only properties
  description?: string;
  endTime?: string;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  enrolledStudents?: number;
  zoomLink?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherClassroomService {
  private apiUrl = 'http://localhost:8088/api/sessions';
  private instructorId = 1; // The current logged-in instructor ID

  constructor(private http: HttpClient) { }

  getTeacherClassroomSessions(): Observable<TeacherClassroomSession[]> {
    // Test the most basic endpoint - just get all sessions
    console.log('Trying simplified endpoint:', `${this.apiUrl}/all`);
    
    return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      map(data => {
        console.log('Got response from /all:', data);
        if (!Array.isArray(data)) return [];
        
        // Filter here in the frontend (not ideal but works for testing)
        return data
          .filter(session => Number(session.instructor_id) === this.instructorId || 
                           Number(session.instructorId) === this.instructorId)
          .map(session => this.mapToSession(session));
      }),
      catchError(error => {
        console.error('Error fetching all sessions:', error);
        
        // For debugging - show what endpoints are available by making an OPTIONS request
        this.http.options(this.apiUrl).subscribe(
          options => console.log('Available API options:', options),
          err => console.log('Could not determine API options')
        );
        
        // After trying, just use mock data
        console.log('Falling back to mock data');
        return of(this.getMockSessions());
      })
    );
  }

  private mapToSession(session: any): TeacherClassroomSession {
    console.log('Mapping session with fields:', Object.keys(session));
  
    return {
      // Fix prop mapping
      idSession: session.idSession || session.id_session || session.id,
      titleSession: session.titleSession || session.title_session || 'Untitled Session',
      sessionSubject: session.sessionSubject || session.session_subject || 'General',
      startTime: session.startTime ? new Date(session.startTime) : 
                session.start_time ? new Date(session.start_time) : new Date(),
      sessionDuration: session.sessionDuration || session.session_duration || 60,
      instructor_id: session.instructor_id || session.instructorId || this.instructorId,
      
      // Frontend props...
      description: session.description || `${session.titleSession || session.title_session || 'Untitled'} session`,
      // Rest of your mapping...
    };
    // Handle snake_case vs camelCase in property names
    const idSession = session.idSession || session.id_session || session.id;
    const titleSession = session.titleSession || session.title_session || session.title || 'Untitled Session';
    const sessionSubject = session.sessionSubject || session.session_subject || session.subject || 'General';
    
    // Handle date parsing
    let startTimeDate: Date;
    if (session.startTime) {
      startTimeDate = new Date(session.startTime);
    } else if (session.start_time) {
      startTimeDate = new Date(session.start_time);
    } else {
      startTimeDate = new Date(); // Default to current time if missing
    }
    
    // Calculate session status based on time
    const now = new Date();
    const sessionDuration = session.sessionDuration || session.session_duration || 60; // Default 60 minutes
    
    // Calculate end time from duration
    const endTimeDate = new Date(startTimeDate.getTime() + sessionDuration * 60000);
    
    // Format times as strings for display
    const startTimeStr = this.formatTimeToString(startTimeDate);
    const endTimeStr = this.formatTimeToString(endTimeDate);
    
    // Determine session status
    let status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    if (session.status === 'cancelled') {
      status = 'cancelled';
    } else if (startTimeDate > now) {
      status = 'scheduled';
    } else if (now >= startTimeDate && now <= endTimeDate) {
      status = 'ongoing';
    } else {
      status = 'completed';
    }
    
    return {
      idSession: idSession,
      titleSession: titleSession,
      sessionSubject: sessionSubject,
      startTime: startTimeDate,
      sessionDuration: sessionDuration,
      instructor_id: session.instructorId || this.instructorId,
      
      // Frontend display properties
      description: session.description || `${titleSession} - ${sessionSubject} session`,
      endTime: endTimeStr,
      status: status,
      enrolledStudents: session.enrolledStudents || Math.floor(Math.random() * 20) + 1,
      zoomLink: session.zoomLink || session.meetingUrl || 'https://zoom.us/j/example'
    };
  }

  private getMockSessions(): TeacherClassroomSession[] {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    return [
      {
        idSession: 101,
        titleSession: 'Introduction to Programming',
        sessionSubject: 'Programming',
        startTime: tomorrow,
        sessionDuration: 120, // 2 hours in minutes
        instructor_id: 1,
        
        // Frontend display properties
        description: 'Learn the basics of programming with JavaScript',
        endTime: '12:00 PM',
        status: 'scheduled',
        enrolledStudents: 15,
        zoomLink: 'https://zoom.us/j/123456789'
      },
      {
        idSession: 102,
        titleSession: 'Advanced Math Concepts',
        sessionSubject: 'Mathematics',
        startTime: today,
        sessionDuration: 120,
        instructor_id: 1,
        
        description: 'Mastering calculus and linear algebra',
        endTime: '16:00 PM',
        status: 'ongoing',
        enrolledStudents: 12,
        zoomLink: 'https://zoom.us/j/987654321'
      },
      {
        idSession: 103,
        titleSession: 'History of Modern Art',
        sessionSubject: 'Art',
        startTime: yesterday,
        sessionDuration: 120,
        instructor_id: 1,
        
        description: 'Exploring art movements of the 20th century',
        endTime: '11:00 AM',
        status: 'completed',
        enrolledStudents: 18,
        zoomLink: 'https://zoom.us/j/567891234'
      }
    ];
  }


  private tryFallbackEndpoints(): Observable<TeacherClassroomSession[]> {
    // Try alternative endpoints in sequence
    const endpoints = [
      `${this.apiUrl}/by-instructor/${this.instructorId}`,
      `${this.apiUrl}?instructor_id=${this.instructorId}`,
      `${this.apiUrl}/all`
    ];
    
    return this.http.get<any[]>(endpoints[0]).pipe(
      map(data => {
        // Use flexible property matching for instructor_id
        return data.filter(session => 
          session.instructor_id === this.instructorId || 
          session.instructorId === this.instructorId
        ).map(session => this.mapToSession(session));
      }),
      catchError(error => {
        // Try second fallback
        console.error('First fallback failed:', error);
        return this.http.get<any[]>(endpoints[1]).pipe(
          map(data => {
            console.log('Fallback 2 response:', data);
            if (!Array.isArray(data)) return [];
            return data
              .filter(session => session.instructorId === this.instructorId)
              .map(session => this.mapToSession(session));
          }),
          catchError(error => {
            // All endpoints failed, use mock data
            console.error('All endpoints failed, using mock data:', error);
            return of(this.getMockSessions());
          })
        );
      })
    );
  } 

  // Helper method to format time
private formatTimeToString(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
}

// Add this method to your service class
createSession(session: Partial<TeacherClassroomSession>): Observable<TeacherClassroomSession> {
  // In a real app, you would post to your backend
  return this.http.post<TeacherClassroomSession>(`${this.apiUrl}`, session).pipe(
    catchError(error => {
      console.error('Error creating session:', error);
      
      // For demonstration, return a mock response
      const mockSession = {
        ...session,
        idSession: Math.floor(Math.random() * 1000) + 200,
        enrolledStudents: 0
      } as TeacherClassroomSession;
      
      return of(mockSession);
    })
  );
}

// Add these methods to your service class
updateSession(session: Partial<TeacherClassroomSession>): Observable<TeacherClassroomSession> {
  return this.http.put<TeacherClassroomSession>(`${this.apiUrl}/${session.idSession}`, session).pipe(
    catchError(error => {
      console.error('Error updating session:', error);
      
      // For demonstration, return the same session with updated fields
      return of(session as TeacherClassroomSession);
    })
  );
}

deleteSession(sessionId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${sessionId}`).pipe(
    catchError(error => {
      console.error('Error deleting session:', error);
      return of({ success: true }); // Mock successful response for demo
    })
  );
}



}