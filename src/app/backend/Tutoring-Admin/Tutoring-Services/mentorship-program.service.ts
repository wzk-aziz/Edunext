import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MentorshipProgram } from '../mentorship-porgram/mentorship-program.model';

@Injectable({
  providedIn: 'root'
})
export class MentorshipProgramService {
  private apiUrl = 'http://localhost:8087/mentorship-programs';  // Match your current backend URL  
  
  loading: boolean = false;

  constructor(private http: HttpClient) { }

  // In mentorship-program.service.ts
  getMentorshipPrograms(): Observable<MentorshipProgram[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      map(data => {
        console.log('Raw data from API:', data);
        return data.map((item: any) => {
          // Extract instructor ID with multiple fallback strategies
          let instructorId = null;
          if (item.instructor_id !== undefined) {
            instructorId = item.instructor_id;
          } else if (item.instructor && item.instructor.idInstructor !== undefined) {
            instructorId = item.instructor.idInstructor;
          } else if (item.instructor && item.instructor.id !== undefined) {
            instructorId = item.instructor.id;
          }
          
          return {
            idMentorshipProgram: item.idMentorshipProgram || 0,
            ProgramName: item.programName || '',
            ProgramDescription: item.programDescription || '',
            ProgramSubject: item.programSubject || '',
            ProgramPrice: item.programPrice || 0,
            ProgramStartDate: item.programStartDate ? new Date(item.programStartDate) : new Date(),
            ProgramEndDate: item.programEndDate ? new Date(item.programEndDate) : new Date(),
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


  // Replace your service's extractMentorshipProgramData method with this:
  private extractMentorshipProgramData(data: any[]): MentorshipProgram[] {
    if (!Array.isArray(data)) {
      console.error('❌ Expected array but got:', typeof data);
      return [];
    }
    
    return data.map((program: any) => {
      console.log('🧩 Processing program ID:', program.idMentorshipProgram);
      
      // Use both camelCase and PascalCase field names
      const name = program.ProgramName || program.programName || '';
      const description = program.ProgramDescription || program.programDescription || '';
      const subject = program.ProgramSubject || program.programSubject || '';
      
      // Parse price with better handling
      let price = 0;
      if (typeof program.ProgramPrice === 'number') {
        price = program.ProgramPrice;
      } else if (typeof program.programPrice === 'number') {
        price = program.programPrice;
      } else if (program.ProgramPrice) {
        price = parseFloat(program.ProgramPrice) || 0;
      } else if (program.programPrice) {
        price = parseFloat(program.programPrice) || 0;
      }
      
      // Better date handling
      let startDate;
      try {
        const startDateValue = program.ProgramStartDate || program.programStartDate;
        if (startDateValue) {
          startDate = new Date(startDateValue);
          if (isNaN(startDate.getTime())) {
            console.warn('⚠️ Invalid start date:', startDateValue);
            startDate = new Date();
          }
        } else {
          startDate = new Date();
        }
      } catch (e) {
        console.error('❌ Error parsing start date:', e);
        startDate = new Date();
      }
      
      let endDate;
      try {
        const endDateValue = program.ProgramEndDate || program.programEndDate;
        if (endDateValue) {
          endDate = new Date(endDateValue);
          if (isNaN(endDate.getTime())) {
            console.warn('⚠️ Invalid end date:', endDateValue);
            endDate = new Date();
          }
        } else {
          endDate = new Date();
        }
      } catch (e) {
        console.error('❌ Error parsing end date:', e);
        endDate = new Date();
      }
      
      // Handle instructor relationship
      let instructorId = null;
      if (program.instructor && typeof program.instructor === 'object') {
        instructorId = program.instructor.idInstructor;
        console.log(`✅ Found instructor ID ${instructorId} for program ${program.idMentorshipProgram}`);
      } else if (program.instructor_id) {
        instructorId = program.instructor_id;
      }
      
      // Create complete program object with all fields properly mapped
      const mappedProgram = {
        idMentorshipProgram: program.idMentorshipProgram || 0,
        ProgramName: name,
        ProgramDescription: description,
        ProgramStartDate: startDate,
        ProgramEndDate: endDate, 
        ProgramSubject: subject,
        ProgramPrice: price,
        instructor_id: instructorId
      };
      
      // Log field values for debugging
      console.log(`📄 Mapped program ${mappedProgram.idMentorshipProgram}:`, 
                  `Name: ${mappedProgram.ProgramName.substring(0, 20)}...,`,
                  `Price: ${mappedProgram.ProgramPrice}`);
                  
      return mappedProgram;
    });
  }
  
  // Improved helper method for cleaning JSON
  private cleanJsonResponse(rawJson: string): string {
    console.log('Cleaning JSON response...');
    
    try {
      // Parse the JSON first
      const data = JSON.parse(rawJson);
      
      // Check if it's an array
      if (Array.isArray(data)) {
        // Process each program to extract only what we need
        const cleanedData = data.map(program => {
          // Log raw program data for debugging
          console.log('Raw program fields:', Object.keys(program));
          
          // Extract all important fields
          return {
            idMentorshipProgram: program.idMentorshipProgram,
            ProgramName: program.ProgramName,
            ProgramDescription: program.ProgramDescription,
            ProgramStartDate: program.ProgramStartDate,
            ProgramEndDate: program.ProgramEndDate,
            ProgramSubject: program.ProgramSubject,
            ProgramPrice: program.ProgramPrice,
            // Get instructor ID directly from the relationship
            instructor_id: program.instructor ? program.instructor.idInstructor : null
          };
        });
        
        // Convert back to JSON string
        return JSON.stringify(cleanedData);
      }
      
      // If not an array, return as is
      return rawJson;
    } catch (e) {
      console.error('Error in cleanJsonResponse:', e);
      
      // If parsing fails, use the regex approach as fallback, but more carefully
      let cleaned = rawJson;
      
      // Extract instructor ID before removing the instructor object
      cleaned = cleaned.replace(/"instructor":\{"idInstructor":(\d+)[^}]*\}/g, 
                              '"instructor":null,"instructor_id":$1');
      
      // Remove other circular references but preserve important fields
      cleaned = cleaned.replace(/"learners":\[[^\]]*\]/g, '"learners":[]');
      cleaned = cleaned.replace(/"goals":\[[^\]]*\]/g, '"goals":[]');
      cleaned = cleaned.replace(/"progressReports":\[[^\]]*\]/g, '"progressReports":[]');
      
      console.log('Cleaned JSON first 100 chars:', cleaned.substring(0, 100) + '...');
      return cleaned;
    }
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
    
    // Convert to camelCase for backend
    const backendProgram = {
      programName: formattedProgram.ProgramName,
      programDescription: formattedProgram.ProgramDescription,
      programStartDate: formattedProgram.ProgramStartDate,
      programEndDate: formattedProgram.ProgramEndDate,
      programSubject: formattedProgram.ProgramSubject,
      programPrice: formattedProgram.ProgramPrice,
      instructor: {
        idInstructor: formattedProgram.instructor_id
      }
    };
    
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
    
    // Add this: Convert to camelCase for backend like in add method
    const backendProgram = {
      programName: formattedProgram.ProgramName,
      programDescription: formattedProgram.ProgramDescription,
      programStartDate: formattedProgram.ProgramStartDate,
      programEndDate: formattedProgram.ProgramEndDate,
      programSubject: formattedProgram.ProgramSubject,
      programPrice: formattedProgram.ProgramPrice,
      instructor: {
        idInstructor: formattedProgram.instructor_id
      }
    };
    
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