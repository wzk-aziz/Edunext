import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ClassroomSession } from '../student-virtual-classroom-sessions/student-virtual-classroom-session.model';

@Injectable({
  providedIn: 'root'
})
export class StudentVirtualClassroomService {
  private apiUrl = 'http://localhost:8088/api/sessions';
  private instructors = new Map<number, { firstName: string, lastName: string }>();
  
  constructor(private http: HttpClient) {
    this.setupMockInstructors();
  }
  
  private setupMockInstructors(): void {
    this.instructors.set(1, { firstName: 'Ahmed', lastName: 'Kaabi' });
    this.instructors.set(2, { firstName: 'Arthur', lastName: 'Morgan' });
  }
  
  getAvailableSessions(): Observable<ClassroomSession[]> {
    console.log("Fetching sessions from:", `${this.apiUrl}/all`);
    
      // Add proper headers - very important!
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  
  // Add OPTIONS to the request
  const options = {
    headers: headers
  };
  


  return this.http.get<any>(`${this.apiUrl}/all`, options).pipe(
    map(response => {
        console.log("Raw API response:", response);
        
        let sessions = response;
        
        if (!Array.isArray(response)) {
          console.log("Response is not an array, checking for sessions property");
          sessions = response.sessions || response.content || response.data || [];
          if (!Array.isArray(sessions)) {
            console.error("Could not find sessions array in response");
            return [];
          }
        }
        
        console.log("Sessions to map:", sessions);
        
        const mappedSessions = sessions
          .map((session: any) => this.mapToClassroomSession(session))
          .filter((session: ClassroomSession | null) => session !== null);
        
        console.log("Mapped sessions:", mappedSessions);
        return mappedSessions;
      }),
      catchError(error => {
        console.error("API error details:", error);
        throw error;
      })
    );
  }
  
  private getInstructorFullName(instructorId: number): string {
    const instructor = this.instructors.get(instructorId);
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : `Instructor ${instructorId}`;
  }
  
  private mapToClassroomSession(apiSession: any): ClassroomSession | null {
    console.log("Mapping database session:", apiSession);
    
    // Check for null/undefined session
    if (!apiSession) {
      console.error("Received null/undefined session object");
      return null;
    }
    
    try {
      // Log the entire raw session for debugging
      console.log("Raw session data:", JSON.stringify(apiSession, null, 2));
      
      // Check for both snake_case (database) and camelCase (entity) field names
      const idSession = apiSession.id_session || apiSession.idSession;
      const titleSession = apiSession.title_session || apiSession.titleSession || "Untitled Session";
      const sessionSubject = apiSession.session_subject || apiSession.sessionSubject || null;
      const startTime = apiSession.start_time || apiSession.startTime;
      const sessionDuration = 
        apiSession.session_duration || 
        apiSession.sessionDuration || 60;
      const instructorId = apiSession.instructor_id || apiSession.instructorId;
      
      console.log("Extracted field values:", {
        idSession,
        titleSession,
        sessionSubject,
        startTime,
        sessionDuration,
        instructorId
      });
      
      // Validate required fields
      if (!idSession) {
        console.warn("Session missing ID:", apiSession);
        // Continue anyway as this might be normal in some APIs
      }
      
      // Handle date parsing safely
      let startTimeDate: Date;
      try {
        startTimeDate = startTime ? new Date(startTime) : new Date();
        if (isNaN(startTimeDate.getTime())) {
          console.warn(`Invalid date format for startTime: ${startTime}`);
          startTimeDate = new Date(); // Fallback to current time
        }
      } catch (e) {
        console.warn(`Error parsing date: ${startTime}`, e);
        startTimeDate = new Date(); // Fallback to current time
      }
      
      // Calculate end time based on session duration
      const durationInMs = Number(sessionDuration) * 60000; // Convert minutes to ms
      const endTime = new Date(startTimeDate.getTime() + durationInMs);
      
      // Determine session status based on current time
      const now = new Date();
      let status: 'live' | 'upcoming' | 'completed';
      
      if (now < startTimeDate) {
        status = 'upcoming';
      } else if (now >= startTimeDate && now <= endTime) {
        status = 'live';
      } else {
        status = 'completed';
      }
      
      // Get instructor name based on ID
      const instructorName = instructorId ? 
        this.getInstructorFullName(Number(instructorId)) : 
        'Unknown Instructor';
      
      // Create and return the mapped session object
      return {
        idSession: idSession,
        titleSession: titleSession,
        sessionSubject: sessionSubject,
        startTime: startTime,
        endTime: endTime.toISOString(),
        sessionDuration: Number(sessionDuration),
        instructorId: instructorId ? Number(instructorId) : undefined,
        instructorName: instructorName,
        status: status,
        description: sessionSubject || "No description available",
        canJoin: status === 'live',
        learnerCount: 0,
        maxLearners: 30
      };
    } catch (err) {
      console.error("Error mapping session:", err, apiSession);
      return null;
    }
  }


  


}