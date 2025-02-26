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
          if (!this.authResponse.mfaEnabled) {
            localStorage.setItem('token', this.authResponse.accessToken as string);
            this.router.navigate(['main']);
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
