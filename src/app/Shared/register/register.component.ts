import { Component } from '@angular/core';
import { RegisterRequest } from '../models/register-request';
import { AuthenticationResponse } from '../models/authentication-response';
import { VerificationRequest } from '../models/verification-request';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerRequest: RegisterRequest = {};
  authResponse: AuthenticationResponse = {};
  message = '';
  otpCode = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  isFormValid(): boolean {
    // Ensure firstname, lastname, email, and password are not empty or undefined
    return !!this.registerRequest.firstname && !!this.registerRequest.lastname && !!this.registerRequest.email && !!this.registerRequest.password;
  }

  // Function to check if the email already exists
  checkEmailExists(email: string) {
    return this.authService.checkEmailExistence(email).pipe(
      catchError(() => {
        // Email does not exist, we can proceed with registration
        return of(false);
      })
    );
  }

  registerUser() {
    if (this.registerRequest.email) {  // Vérifie si l'email existe
      this.message = '';
      this.authService.register(this.registerRequest)
        .subscribe({
          next: (response) => {
            if (response) {
              this.authResponse = response;
            } else {
              this.message = 'Account created successfully\nYou will be redirected to the Login page in 3 seconds';
              setTimeout(() => {
                this.router.navigate(['login']);
              }, 2000);
            }
          },
          error: (err) => {
            this.message = err.message; // Affiche l'erreur reçue
          }
        });
    } else {
      this.message = 'Email is required';
    }
  }
  
  

  verifyTfa() {
    this.message = '';
    const verifyRequest: VerificationRequest = {
      email: this.registerRequest.email,
      code: this.otpCode
    };

    this.authService.verifyCode(verifyRequest)
      .subscribe({
        next: (response) => {
          this.message = 'Account created successfully\nYou will be redirected to the EduNext page in 3 seconds';
          setTimeout(() => {
            localStorage.setItem('token', response.accessToken as string);
            this.router.navigate(['login']);
          }, 2000);
        },
        error: (err) => {
          this.message = 'Verification failed. Please try again.';
        }
      });
  }
}
