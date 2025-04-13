
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserStatusModel, UserStatus } from 'src/app/models/UserStatus.model';

@Injectable({
  providedIn: 'root'
})
export class UserStatusService {
  private apiUrl = 'api/user-status'; // Replace with your actual API endpoint
  
  // Optional local cache for user statuses
  private userStatusCache: Map<string, UserStatusModel> = new Map();
  
  constructor(private http: HttpClient) {}
  
  getUserStatus(email: string): Observable<UserStatusModel> {
    // Check if we have a cached version first
    if (this.userStatusCache.has(email)) {
      return of(this.userStatusCache.get(email)!);
    }
    
    return this.http.get<any>(`${this.apiUrl}/${email}`).pipe(
      map(response => {
        const userStatus = new UserStatusModel(email);
        
        // Map response to our model
        if (response) {
          userStatus.statusInfo.status = response.status || UserStatus.ACTIVE;
          userStatus.statusInfo.lastLoginDate = response.lastLoginDate ? new Date(response.lastLoginDate) : undefined;
          userStatus.statusInfo.lastStatusChange = response.lastStatusChange ? new Date(response.lastStatusChange) : undefined;
          userStatus.statusInfo.statusReason = response.statusReason;
          userStatus.statusInfo.loginAttempts = response.loginAttempts || 0;
          userStatus.statusInfo.maxLoginAttempts = response.maxLoginAttempts || 5;
        }
        
        // Cache the result
        this.userStatusCache.set(email, userStatus);
        
        return userStatus;
      }),
      catchError(error => {
        console.error('Error fetching user status:', error);
        // Return a default active status if API fails
        const defaultStatus = new UserStatusModel(email);
        return of(defaultStatus);
      })
    );
  }
  
  updateUserStatus(userStatus: UserStatusModel): Observable<any> {
    // Update the cache
    this.userStatusCache.set(userStatus.email, userStatus);
    
    // Send to backend
    return this.http.post(`${this.apiUrl}/${userStatus.email}`, {
      status: userStatus.statusInfo.status,
      lastLoginDate: userStatus.statusInfo.lastLoginDate,
      lastStatusChange: userStatus.statusInfo.lastStatusChange,
      statusReason: userStatus.statusInfo.statusReason,
      loginAttempts: userStatus.statusInfo.loginAttempts,
      maxLoginAttempts: userStatus.statusInfo.maxLoginAttempts
    }).pipe(
      catchError(error => {
        console.error('Error updating user status:', error);
        return of(null);
      })
    );
  }
  
  // Method for sending status-based emails
  sendStatusEmail(userStatus: UserStatusModel, templateName: string): Observable<any> {
    return this.http.post(`api/email/${templateName}`, {
      email: userStatus.email,
      statusInfo: userStatus.statusInfo,
      statusMessage: userStatus.getStatusForEmail()
    });
  }
}