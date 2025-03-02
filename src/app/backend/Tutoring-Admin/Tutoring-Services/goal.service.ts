import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Goal } from '../goal/goal.model';
import { Observable,throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private apiUrl = 'http://localhost:8087/goals';

  constructor(private http: HttpClient) { }

  getGoals(): Observable<Goal[]> {
    console.log('⏳ Fetching goals from:', `${this.apiUrl}/all`);
    
    // Use responseType: 'text' to see raw response
    return this.http.get(`${this.apiUrl}/all`, { responseType: 'text' }).pipe(
      tap(rawText => console.log('📄 Raw text response:', rawText)),
      map(rawText => {
        try {
          if (!rawText || rawText.trim() === '') {
            console.warn('⚠️ Empty response from API');
            return [];
          }
          
          const data = JSON.parse(rawText);
          console.log('✅ JSON parsed successfully:', data);
          
          if (!Array.isArray(data)) {
            console.warn('⚠️ API did not return an array:', data);
            return [];
          }
          
          return data.map(goal => {
            console.log('🔄 Processing goal item:', goal);
            
            // Format date consistently
            let formattedDate = goal.goalTargetDate || '';
            
            // If date is in ISO format, extract just the YYYY-MM-DD part
            if (formattedDate && formattedDate.includes('T')) {
              formattedDate = formattedDate.split('T')[0];
            }
            
            // Handle mentorshipProgramId from either direct property or nested object
            let mentorshipProgramId = null;
            if (goal.mentorshipProgramId !== undefined) {
              mentorshipProgramId = goal.mentorshipProgramId;
            } else if (goal.mentorshipProgram && typeof goal.mentorshipProgram === 'object') {
              mentorshipProgramId = goal.mentorshipProgram.idMentorshipProgram;
            } else if (typeof goal.mentorshipProgram === 'number') {
              mentorshipProgramId = goal.mentorshipProgram;
            }
            
            return {
              idGoal: goal.idGoal || 0,
              goalDescription: goal.goalDescription || '',
              goalTargetDate: formattedDate,
              mentorshipProgramId: mentorshipProgramId || 0,
              mentorshipProgram: goal.mentorshipProgram
            };
          });
        } catch (e) {
          console.error('❌ JSON parsing error:', e);
          return [];
        }
      }),
      tap(goals => console.log('✅ Processed goals:', goals)),
      catchError(error => {
        console.error('❌ Error in getGoals():', error);
        return throwError(() => new Error(`Failed to load goals: ${error.message}`));
      })
    );
  }

  getGoalById(id: number): Observable<Goal> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(goal => ({
        idGoal: goal.idGoal || 0,
        goalDescription: goal.goalDescription || '',
        goalTargetDate: goal.goalTargetDate || '',
        mentorshipProgramId: goal.mentorshipProgramId || 
                            (goal.mentorshipProgram?.idMentorshipProgram) || 0,
        mentorshipProgram: goal.mentorshipProgram
      })),
      catchError(error => {
        console.error(`Failed to fetch goal ${id}:`, error);
        return throwError(() => new Error(`Failed to load goal: ${error.message}`));
      })
    );
  }

  createGoal(goal: Goal): Observable<Goal> {
    // Keep a copy of the original ID for fallback
    const originalProgramId = goal.mentorshipProgramId;
    
    // Convert from frontend model to backend format
    const backendGoal = {
      goalDescription: goal.goalDescription,
      goalTargetDate: goal.goalTargetDate,
      mentorshipProgram: {
        idMentorshipProgram: originalProgramId
      }
    };
  
    console.log('Creating goal with data:', JSON.stringify(backendGoal, null, 2));
  
    return this.http.post<any>(this.apiUrl, backendGoal, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      tap(response => {
        console.log('Create response:', response);
        console.log('Response mentorshipProgramId:', response.mentorshipProgramId);
        console.log('Response mentorshipProgram:', response.mentorshipProgram);
      }),
      map(data => {
        // Better extraction of mentorshipProgramId with more detailed logging
        let extractedProgramId = null;
        
        if (data.mentorshipProgramId !== undefined) {
          console.log('Using direct mentorshipProgramId:', data.mentorshipProgramId);
          extractedProgramId = data.mentorshipProgramId;
        } else if (data.mentorshipProgram?.idMentorshipProgram) {
          console.log('Using nested mentorshipProgram.idMentorshipProgram:', data.mentorshipProgram.idMentorshipProgram);
          extractedProgramId = data.mentorshipProgram.idMentorshipProgram;
        } else {
          console.log('Using original programId as fallback:', originalProgramId);
          extractedProgramId = originalProgramId;
        }
        
        return {
          idGoal: data.idGoal || 0,
          goalDescription: data.goalDescription || '',
          goalTargetDate: data.goalTargetDate || '',
          mentorshipProgramId: extractedProgramId,
          mentorshipProgram: data.mentorshipProgram || { idMentorshipProgram: extractedProgramId }
        };
      }),
      catchError(error => {
        console.error('Failed to create goal:', error);
        return throwError(() => new Error(`Failed to create goal: ${error.message}`));
      })
    );
  }

    updateGoal(goal: Goal): Observable<Goal> {
    const backendGoal = {
      goalDescription: goal.goalDescription,
      goalTargetDate: goal.goalTargetDate,
      mentorshipProgram: {
        idMentorshipProgram: goal.mentorshipProgramId
      }
    };
    
    console.log('Updating goal with data:', backendGoal);
    
    return this.http.put<any>(`${this.apiUrl}/${goal.idGoal}`, backendGoal, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap(data => console.log('Update response:', data)), // Use tap to log data without affecting the pipe
      map(data => {
        const extractedProgramId = this.extractProgramId(data, goal.mentorshipProgramId);
        
        return {
          idGoal: data.idGoal || goal.idGoal,
          goalDescription: data.goalDescription || goal.goalDescription,
          goalTargetDate: data.goalTargetDate || goal.goalTargetDate,
          mentorshipProgramId: extractedProgramId,
          mentorshipProgram: data.mentorshipProgram || { idMentorshipProgram: extractedProgramId }
        };
      }),
      catchError(error => {
        console.error('Failed to update goal:', error);
        return throwError(() => new Error(`Failed to update goal: ${error.message}`));
      })
    );
  }
  
  // Helper method to extract program ID from various formats
  private extractProgramId(data: any, fallbackId: number): number {
    if (data.mentorshipProgram) {
      if (typeof data.mentorshipProgram === 'object' && data.mentorshipProgram.idMentorshipProgram) {
        return data.mentorshipProgram.idMentorshipProgram;
      } else if (typeof data.mentorshipProgram === 'number') {
        return data.mentorshipProgram;
      }
    } else if (data.mentorshipProgramId) {
      return data.mentorshipProgramId;
    }
    return fallbackId;
  }Goal(goal: Goal): Observable<Goal> {
    // Keep a copy of the original ID for fallback
    const originalProgramId = goal.mentorshipProgramId;
    
    // Define backendGoal object before using it
    const backendGoal = {
      goalDescription: goal.goalDescription,
      goalTargetDate: goal.goalTargetDate,
      mentorshipProgram: {
        idMentorshipProgram: goal.mentorshipProgramId
      }
    };
    
    console.log('Updating goal with data:', backendGoal);
    
    return this.http.put<any>(`${this.apiUrl}/${goal.idGoal}`, backendGoal, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(data => {
        let extractedProgramId = null;
        
        if (data.mentorshipProgramId !== undefined) {
          extractedProgramId = data.mentorshipProgramId;
        } else if (data.mentorshipProgram?.idMentorshipProgram) {
          extractedProgramId = data.mentorshipProgram.idMentorshipProgram;
        } else {
          extractedProgramId = originalProgramId;
        }
        
        return {
          idGoal: data.idGoal || 0,
          goalDescription: data.goalDescription || '',
          goalTargetDate: data.goalTargetDate || '',
          mentorshipProgramId: extractedProgramId,
          mentorshipProgram: data.mentorshipProgram || { idMentorshipProgram: extractedProgramId }
        };
      }),
      catchError(error => {
        console.error('Failed to update goal:', error);
        return throwError(() => new Error(`Failed to update goal: ${error.message}`));
      })
    );
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Goal ${id} deleted successfully`)),
      catchError(error => {
        console.error(`Failed to delete goal ${id}:`, error);
        return throwError(() => new Error(`Failed to delete goal: ${error.message}`));
      })
    );
  }
}