import { Component } from '@angular/core';
import { AuthenticationRequest } from '../models/authentication-request';
import { AuthenticationResponse } from '../models/authentication-response';
import { VerificationRequest } from '../models/verification-request';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  authRequest: AuthenticationRequest = {};
  otpCode = '';
  authResponse: AuthenticationResponse = {};
  errorMessage: string | null = null;  // Store error messages

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  authenticate() {
    this.authService.login(this.authRequest)
      .subscribe({
        next: (response) => {
          this.authResponse = response;

          // Debugging the role to check its value
          console.log("User role:", this.authResponse.role);

          if (!this.authResponse.mfaEnabled) {
            localStorage.setItem('token', this.authResponse.accessToken as string);
            
            // Check user role and navigate accordingly, ensuring case sensitivity is handled
            const userRole = this.authResponse.role?.toUpperCase(); // Ensure case consistency
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
          if (err.status === 400) {
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
          localStorage.setItem('token', response.accessToken as string);
          this.router.navigate(['main']);
        }
      });
  }
}