import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MentorshipProgram } from '../mentorship-porgram/mentorship-program.model';

@Injectable({
  providedIn: 'root'
})
export class MentorshipProgramService {
  private apiUrl = 'http://localhost:9090/mentorship-programs';  // Match your current backend URL  
  
  loading: boolean = false;

  constructor(private http: HttpClient) { }

  // In mentorship-program.service.ts
  // In your mentorship-program.service.ts file's getMentorshipPrograms method
  getMentorshipPrograms(): Observable<MentorshipProgram[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      map(data => {
        console.log('Raw data from API:', JSON.stringify(data).substring(0, 200) + '...');
        
        if (!Array.isArray(data)) {
          console.warn('API did not return an array, returning empty array');
          return [];
        }
        
        return data.map((item: any): MentorshipProgram => {
          // Extract instructor ID with multiple fallback strategies
          let instructorId = null;
          
          if (item.instructor && typeof item.instructor === 'object') {
            instructorId = item.instructor.idInstructor || item.instructor.id;
          } else if (item.instructor_id !== undefined) {
            instructorId = item.instructor_id;
          } else if (item.instructorId !== undefined) {
            instructorId = item.instructorId;
          }
          
          // Always return a complete MentorshipProgram object with all required properties
          return {
            idMentorshipProgram: item.idMentorshipProgram || item.id || 0,
            ProgramName: item.programName || item.ProgramName || '',
            ProgramDescription: item.programDescription || item.ProgramDescription || '',
            ProgramStartDate: item.programStartDate ? new Date(item.programStartDate) : 
                             (item.ProgramStartDate ? new Date(item.ProgramStartDate) : new Date()),
            ProgramEndDate: item.programEndDate ? new Date(item.programEndDate) : 
                           (item.ProgramEndDate ? new Date(item.ProgramEndDate) : new Date()),
            ProgramSubject: item.programSubject || item.ProgramSubject || '',
            ProgramPrice: parseFloat(item.programPrice || item.ProgramPrice || 0),
            instructor_id: instructorId || 0
          };
        });
      }),
      catchError(error => {
        console.error('Error fetching mentorship programs:', error);
        return of([]);
      })
    );
  }


  // Get a single mentorship program by ID
  getMentorshipProgramById(id: number): Observable<MentorshipProgram> {
    return this.http.get<MentorshipProgram>(`${this.apiUrl}/${id}`).pipe(
      tap(program => console.log('Fetched program:', program.ProgramName)),
      catchError(this.handleError<MentorshipProgram>('getMentorshipProgramById'))
    );
  }

  
  // Around line 211 in the addMentorshipProgram method
  addMentorshipProgram(program: MentorshipProgram): Observable<MentorshipProgram> {
    // Format dates properly for backend
    const formattedProgram = this.formatDatesForBackend(program);
    const originalInstructorId = program.instructor_id; 

    // Convert to camelCase for backend
    const backendProgram = {
      programName: formattedProgram.ProgramName,
      programDescription: formattedProgram.ProgramDescription,
      programStartDate: formattedProgram.ProgramStartDate,
      programEndDate: formattedProgram.ProgramEndDate,
      programSubject: formattedProgram.ProgramSubject,
      programPrice: formattedProgram.ProgramPrice,
      
      instructor_id: originalInstructorId,
      instructorId: originalInstructorId,
      instructor: {
        id: originalInstructorId,
        idInstructor: originalInstructorId
      },
     

    };
      console.log('POST request with instructor ID:', originalInstructorId);

    // Add this logging
    console.log('POST request payload:', JSON.stringify(backendProgram, null, 2));
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
    
    return this.http.post<MentorshipProgram>(
      this.apiUrl, 
      backendProgram, 
      httpOptions
    ).pipe(
      tap(response => {
        console.log('Create response:', response);
        
        // Log specifically the structure of the response
        console.log('Response structure:', {
          hasId: !!response?.idMentorshipProgram,
          fields: Object.keys(response || {})
        });
      }),
      catchError(this.handleError<MentorshipProgram>('addMentorshipProgram'))
    );
  }
  
  // Around line 241 in the editMentorshipProgram method
  editMentorshipProgram(program: MentorshipProgram): Observable<any> {
    const formattedProgram = this.formatDatesForBackend(program);
    const originalInstructorId = program.instructor_id;

    // Add this: Convert to camelCase for backend like in add method
    const backendProgram = {
      programName: formattedProgram.ProgramName,
      programDescription: formattedProgram.ProgramDescription,
      programStartDate: formattedProgram.ProgramStartDate,
      programEndDate: formattedProgram.ProgramEndDate,
      programSubject: formattedProgram.ProgramSubject,
      programPrice: formattedProgram.ProgramPrice,
      instructor_id: originalInstructorId,
      instructorId: originalInstructorId,
      instructor: {
        id: originalInstructorId,
        idInstructor: originalInstructorId
      }

    };
    console.log('PUT request with instructor ID:', originalInstructorId);

    
    // Add this logging
    console.log('PUT request payload for ID ' + program.idMentorshipProgram + ':', 
      JSON.stringify(backendProgram, null, 2));
    
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json') // Add this line
    };
    
    return this.http.put<MentorshipProgram>(
      `${this.apiUrl}/${program.idMentorshipProgram}`, 
      backendProgram, // Use backendProgram instead of formattedProgram
      httpOptions
    ).pipe(
      tap(response => {
        console.log('Update response:', response);
        
        // Log specifically the structure of the response
        console.log('Response structure:', {
          hasId: !!response?.idMentorshipProgram,
          fields: Object.keys(response || {})
        });
      }),
      catchError(this.handleError<MentorshipProgram>('editMentorshipProgram'))
    );
  }

  // Delete a mentorship program
  deleteMentorshipProgram(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(_ => console.log('Deleted program ID:', id)),
      catchError(this.handleError<any>('deleteMentorshipProgram'))
    );
  }


  // Then update your error handler method:
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      if (error instanceof HttpErrorResponse) {
        console.error(`Status: ${error.status}, ${error.statusText}`);
        console.error('Full response:', error);
        
        // More detailed error info for debugging
        if (error.error instanceof Error) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error('Server-side error:', error.error);
        }
      }
      
      // Let the app keep running by returning an empty result
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }

  // Improved helper method to format dates correctly for the backend
  private formatDatesForBackend(program: MentorshipProgram): any {
    // Create a deep copy to avoid modifying the original
    const formattedProgram = JSON.parse(JSON.stringify(program));
    
    // Check and format dates properly
    try {
      if (formattedProgram.ProgramStartDate) {
        // Handle both Date objects and strings
        const startDate = formattedProgram.ProgramStartDate instanceof Date ? 
          formattedProgram.ProgramStartDate : new Date(formattedProgram.ProgramStartDate);
          
        if (!isNaN(startDate.getTime())) {
          formattedProgram.ProgramStartDate = startDate.toISOString();
        }
      }
      
      if (formattedProgram.ProgramEndDate) {
        // Handle both Date objects and strings
        const endDate = formattedProgram.ProgramEndDate instanceof Date ? 
          formattedProgram.ProgramEndDate : new Date(formattedProgram.ProgramEndDate);
          
        if (!isNaN(endDate.getTime())) {
          formattedProgram.ProgramEndDate = endDate.toISOString();
        }
      }
    } catch (e) {
      console.error('Error formatting dates:', e);
    }
    
    console.log('Formatted program for backend:', formattedProgram);
    return formattedProgram;
  }
  
  // Debug method to test API connection
  debugFetchPrograms(): Observable<any> {
    console.log('Debug fetch mentorship programs called');
    
    return this.http.get(`${this.apiUrl}/all`, { responseType: 'text' }).pipe(
      tap(response => {
        console.log('Raw API response:', response.substring(0, 200) + '...');
        try {
          const data = JSON.parse(response);
          console.log('Parsed data:', data);
          return of(data);
        } catch (e) {
          console.error('Failed to parse response:', e);
          return throwError(() => new Error('Failed to parse API response'));
        }
      }),
      catchError(error => {
        console.error('Debug fetch error:', error);
        return throwError(() => error);
      })
    );
  }

}