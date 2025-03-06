import { Component } from '@angular/core';
import { AuthenticationRequest } from '../models/authentication-request';
import { AuthenticationResponse } from '../models/authentication-response';
import { VerificationRequest } from '../models/verification-request';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { UserStatusModel, UserStatus } from 'src/app/models/UserStatus.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  authRequest: AuthenticationRequest = {};
  otpCode = '';
  authResponse: AuthenticationResponse = {};
  errorMessage: string | null = null;
  userStatus: UserStatusModel | null = null;
  
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}
  
  authenticate() {
    // Create or retrieve user status
    if (this.authRequest.email) {
      this.userStatus = new UserStatusModel(this.authRequest.email);
      
      // You would typically retrieve existing user status from a service
      // this.userStatusService.getUserStatus(this.authRequest.email).subscribe(status => {
      //   this.userStatus = status;
      // });
    }
    
    this.authService.login(this.authRequest)
      .subscribe({
        next: (response) => {
          this.authResponse = response;
          
          // Update user status on successful login
          if (this.userStatus) {
            this.userStatus.updateLastLogin();
            // You would typically save this status update
            // this.userStatusService.updateUserStatus(this.userStatus).subscribe();
          }
          
          console.log("User role:", this.authResponse.role);
          console.log("User status:", this.userStatus?.statusInfo.status);
          
          if (!this.authResponse.mfaEnabled) {
            localStorage.setItem('token', this.authResponse.accessToken as string);
            
            // Check if user is active before allowing login
            if (this.userStatus && !this.userStatus.isActive() && !this.userStatus.isPending()) {
              this.errorMessage = `Account is ${this.userStatus.statusInfo.status}. ${this.userStatus.statusInfo.statusReason || ''}`;
              return;
            }
            
            const userRole = this.authResponse.role?.toUpperCase();
            if (userRole === 'TEACHER') {
              this.router.navigate(['listTeachers']).catch(err => console.error('Navigation error:', err));
            } else if (userRole === 'LEARNER') {
              this.router.navigate(['studenthome']).catch(err => console.error('Navigation error:', err));
            } else {
              this.router.navigate(['defaultPage']).catch(err => console.error('Navigation error:', err));
            }
          }
        },
        error: (err) => {
          // Increment login attempts on failure
          this.userStatus?.incrementLoginAttempt();
          
          // You would typically save this status update
          // this.userStatusService.updateUserStatus(this.userStatus).subscribe();
          
          if (this.userStatus?.statusInfo.status === UserStatus.LOCKED) {
            this.errorMessage = 'Account locked due to too many failed attempts. Please contact support.';
          } else if (err.status === 400) {
            this.errorMessage = 'Email is not valid';
          } else if (err.status === 401) {
            this.errorMessage = 'Password is incorrect';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        }
      });
  }
  
  verifyCode() {
    const verifyRequest: VerificationRequest = {
      email: this.authRequest.email,
      code: this.otpCode
    };
    
    this.authService.verifyCode(verifyRequest)
      .subscribe({
        next: (response) => {
          // Update user status after successful verification
          if (this.userStatus) {
            this.userStatus.updateLastLogin();
            // this.userStatusService.updateUserStatus(this.userStatus).subscribe();
          }
          
          localStorage.setItem('token', response.accessToken as string);
          this.router.navigate(['main']);
        },
        error: (err) => {
          this.errorMessage = 'Invalid verification code. Please try again.';
        }
      });
  }
}