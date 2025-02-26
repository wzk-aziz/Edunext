import { Component } from '@angular/core';
import { RegisterRequest } from '../models/register-request';
import { AuthenticationResponse } from '../models/authentication-response';
import { VerificationRequest } from '../models/verification-request';
import { AuthenticationService } from '../services/authentication.service';
import {Router} from "@angular/router";
import { timeout } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerRequest: RegisterRequest = {} ;
  authResponse: AuthenticationResponse = {} ;
  message = '';
  otpCode = '';

  constructor(
     private authService: AuthenticationService,
     private router: Router
     
     ) { 
  }

  isFormValid(): boolean {
    // Ensure firstname, lastname, email, and password are not empty or undefined
    return !!this.registerRequest.firstname && !!this.registerRequest.lastname && !!this.registerRequest.email && !!this.registerRequest.password;
  }

  

  registerUser() {
    this.message='';
    this.authService.register(this.registerRequest)
    .subscribe({
      next: (response) => {
        if(response) {
          this.authResponse = response;
        } else {
          this.message = 'Account created successfully\nYou will be redirected to the Login page in 3 seconds' ;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 3000);
        }
      } 
    });
   }


   verifyTfa() {
    this.message='';
    const verifyRequest: VerificationRequest = {
      email: this.registerRequest.email,
      code: this.otpCode
    };
    this.authService.verifyCode(verifyRequest)
    .subscribe({
      next: (response) => {
        this.message = 'Account created successfully\nYou will be redirected to the EduNext page in 3 seconds' ;
        setTimeout(() => {
          localStorage.setItem('token', response.accessToken as string);
          this.router.navigate(['login']);
        }, 3000);
   }

    });
  }
}

