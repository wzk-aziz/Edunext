import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from 'src/app/models/AuthenticationRequest';
import { AuthenticationResponse } from 'src/app/models/AuthenticationResponse';
import { AuthenticationServiceService } from 'src/app/Services/authentication-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authRequest: AuthenticationRequest = {};
  authResponse: AuthenticationResponse = {
    userId: 0
  };
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private authService: AuthenticationServiceService,
    private router: Router
  ) {}

  authenticate() {
    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.authRequest)
      .subscribe({
        next: (response) => {
          this.authResponse = response;

          console.log("User role:", this.authResponse.role);

          localStorage.setItem('token', this.authResponse.accessToken??'');
          localStorage.setItem('user', JSON.stringify({
            first_name: this.authResponse.first_name,
            last_name: this.authResponse.last_name,
            email_address: this.authResponse.email_address
          }));
          console.log("Réponse complète du backend:", this.authResponse);

          if (this.authResponse.role === 'TEACHER') {
            this.router.navigate(['/listTeachers'])
              .then(() => console.log("Navigation réussie vers listTeachers"))
              .catch(err => console.error("Erreur de navigation :", err));
          } else if (this.authResponse.role === 'LEARNER') {
            this.router.navigate(['/studenthome'])
              .then(() => console.log("Navigation réussie vers studenthome"))
              .catch(err => console.error("Erreur de navigation :", err));
          } else {
            console.error('Rôle inconnu:', this.authResponse.role);
            this.errorMessage = 'Erreur de rôle, contactez le support.';
          }
          
        },
        error: (err) => {
          this.loading = false;
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
}
