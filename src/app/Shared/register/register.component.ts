import { Component } from '@angular/core';
import { RegisterRequest } from '../models/register-request';
import { AuthenticationResponse } from '../models/authentication-response';
import { VerificationRequest } from '../models/verification-request';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { RecaptchaErrorParameters } from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerRequest: RegisterRequest = {};
  authResponse: AuthenticationResponse = {};
  message = '';
  errorMessage = ''; // Add errorMessage for red alert
  otpCode = '';
  selectedFile?: File;  // Ajout de la variable pour stocker le fichier
  recaptchaResponse: string | null = null; // Initialize recaptchaResponse

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  onResolved(captchaResponse: string | null) {
    console.log(`Réponse du captcha: ${captchaResponse}`);
    this.recaptchaResponse = captchaResponse; // Vous pouvez l'envoyer à votre backend pour vérification
  }

  onSubmit() {
    // Implémentation de la soumission de votre formulaire
    if (this.recaptchaResponse) {
      console.log('Formulaire soumis avec succès');
    } else {
      console.log('Captcha non résolu');
    }
  }

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

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0]; // Stocke le fichier sélectionné
    }
  }

  registerUser() {
    if (this.isFormValid() && this.recaptchaResponse) {
      this.message = '';
      this.errorMessage = ''; // Clear error message
      
      const formData = new FormData();
      formData.append('request', JSON.stringify(this.registerRequest));
      formData.append('recaptchaResponse', this.recaptchaResponse);
      
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
  
      this.authService.registerWithFile(formData).subscribe({
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
          // Check for specific error responses
          if (err.error && typeof err.error === 'string') {
            this.errorMessage = err.error; // This will capture the exact message from the backend
          } else if (err.status === 400) {
            this.errorMessage = 'Registration failed. Please check your input for forbidden words.';
          } else {
            this.errorMessage = 'An error occurred during registration. Please try again.';
          }
          console.error('Registration error:', err);
        }
      });
    } else {
      this.errorMessage = 'You have to fill the fields and resolve the reCAPTCHA!!!';
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

  loginWithGoogle() {
    this.authService.googleLogin(this.getGoogleAuthRequest()).subscribe({
      next: (response) => {
        console.log('Connexion réussie :', response);
        // Gérer l'authentification ici (ex: stockage du token, redirection...)
      },
      error: (err) => {
        console.error('Erreur de connexion Google :', err);
      }
    });
  }
  
  // Fonction pour récupérer l'objet googleAuthRequest
  getGoogleAuthRequest() {
    // Supposons que vous utilisez Google Sign-In
    return { token: 'GOOGLE_AUTH_TOKEN' }; // Remplacez par le vrai token récupéré
  }
  
}
