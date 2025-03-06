import { Component } from '@angular/core';
import { RegisterRequest } from '../models/register-request';
import { AuthenticationResponse } from '../models/authentication-response';
import { VerificationRequest } from '../models/verification-request';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

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
    private socialAuthService: SocialAuthService,
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
    if (this.isFormValid() && this.recaptchaResponse) { // Ensure reCAPTCHA is resolved
      this.message = '';
      this.errorMessage = ''; // Clear error message
      
      // Création d'un `FormData` pour envoyer les données et le fichier
      const formData = new FormData();
      formData.append('request', JSON.stringify(this.registerRequest));
      formData.append('recaptchaResponse', this.recaptchaResponse); // Add reCAPTCHA response
      
      if (this.selectedFile) {
        formData.append('file', this.selectedFile); // Ajoute le fichier à l'envoi
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
          this.message = err.message;
        }
      });
    } else {
      this.errorMessage = 'You have to fill the fields and resolve the reCAPTCHA!!!'; // Set error message
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
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(user => {
        console.log('Google sign in successful:', user);
        this.handleGoogleLogin(user);
      })
      .catch(error => {
        console.error('Google sign in failed:', error);
        this.errorMessage = 'Google sign in failed';
      });
  }

  private handleGoogleLogin(user: SocialUser): void {
    console.log('Handling Google login for user:', user);
    
    const googleAuthRequest = {
      token: user.idToken,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl
    };

    this.authService.googleLogin(googleAuthRequest).subscribe({
      next: (response) => {
        if (response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          
          const userRole = response.role?.toUpperCase();
          switch(userRole) {
            case 'ADMIN':
              this.router.navigate(['backoffice']);
              break;
            case 'TEACHER':
              this.router.navigate(['listTeachers']);
              break;
            case 'LEARNER':
              this.router.navigate(['studenthome']);
              break;
            default:
              this.router.navigate(['main']);
          }
        }
      },
      error: (err) => {
        console.error('Google login error:', err);
        this.errorMessage = 'Google authentication failed';
      }
    });
  }
}
