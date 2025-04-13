import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../models/register-request';
import { AuthenticationResponse } from '../models/authentication-response';
import { VerificationRequest } from '../models/verification-request';
import { AuthenticationRequest } from '../models/authentication-request';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private baseUrl: string = 'http://localhost:9090/api/v1/auth';
  private apiUrl: string = 'http://localhost:9090/api/v1/auth/logout'; 




  constructor(
    private http: HttpClient, private router: Router
  ) { }

  checkEmailExistence(email: string | undefined): Observable<boolean> {
    if (!email) {
      return throwError(() => new Error('Email is required'));
    }
    return this.http.get<boolean>(`${this.baseUrl}/check-email?email=${email}`);
  }
  

  registerWithFile(formData: FormData): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/register`, formData);
  }
  


  register(registerRequest: RegisterRequest): Observable<AuthenticationResponse> {
    if (!registerRequest.email) {
      return throwError(() => new Error('Email is required'));
    }
  
    return this.checkEmailExistence(registerRequest.email).pipe(
      catchError((error) => {
        // Check if error status is 400 (Bad Request) and handle accordingly
        if (error.status === 400 && error.error === 'Email is already in use') {
          return throwError(() => new Error('Email is already in use'));
        } else {
          return throwError(() => new Error('An error occurred while checking email.'));
        }
      }),
      switchMap(() => {
        return this.http.post<AuthenticationResponse>(`${this.baseUrl}/register`, registerRequest);
      })
    );
  }

 
  
  
  
  



  login(authRequest: AuthenticationRequest) {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, authRequest);
  }

  verifyCode(VerificationRequest: VerificationRequest) {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/verify`, VerificationRequest);
  }



  logout() {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    this.http.post('http://localhost:8050/api/v1/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        localStorage.removeItem('token'); // Supprime le token
        sessionStorage.clear(); // Supprime toutes les sessions
        this.router.navigate(['/login']); // Redirige vers la page de connexion
      },
      error: (err) => {
        console.error('Erreur de déconnexion', err);
        localStorage.removeItem('token'); // Supprimer le token même si l'API échoue
        this.router.navigate(['/login']);
      }
    });

  }

  googleLogin(googleAuthRequest: any): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/auth/google`, googleAuthRequest);
  }

  getUserId(): number {
    const userJson = localStorage.getItem('user');
    if (!userJson) return 0;
  
    try {
      const user = JSON.parse(userJson);
      return user.userId ?? 0; // ← récupère userId au lieu de id
    } catch (e) {
      return 0;
    }
  }
  
  





  
}