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

  loading: boolean = false;  // Déclaration de la propriété 'loading'
  authRequest: AuthenticationRequest = {};
  otpCode = '';
  authResponse: AuthenticationResponse = {};
  errorMessage: string | null = null;  // Store error messages

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  authenticate() {
    this.loading = true;  // Activer l'indicateur de chargement
  
    // Retarder l'appel à authService.login() de 3 secondes
    setTimeout(() => {
      this.authService.login(this.authRequest)
        .subscribe({
          next: (response) => {
            this.loading = false;  // Désactiver l'indicateur de chargement
            this.authResponse = response;
  
            if (!this.authResponse.mfaEnabled) {
              localStorage.setItem('token', this.authResponse.accessToken as string);
              this.router.navigate(['main']);
            }
          },
          error: (err) => {
            this.loading = false;  // Désactiver l'indicateur de chargement en cas d'erreur
  
            if (err.status === 400) {
              this.errorMessage = 'Email is not valid';
            } else if (err.status === 401) {
              this.errorMessage = 'Password is incorrect';
            } else {
              this.errorMessage = 'An error occurred. Please try again later.';
            }
          }
        });
    }, 2000);  // 2000 ms = 2 secondes
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
