import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthenticationResponse } from '../models/AuthenticationResponse';
import { RegisterRequest } from './RegisterRequest';
import { AuthenticationRequest } from '../models/AuthenticationRequest';
import{VerificationRequest} from '../models/VerificationRequest';
import { User } from '../models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {

  private baseUrl: string = 'http://localhost:9090/api/v1/auth';
  private apiUrl = 'http://localhost:9090/api/v1/auth/logout'; 
  private user: User | null = null;


  constructor(
    private http: HttpClient, private router: Router
  ) { }

  checkEmailExistence(email: string | undefined): Observable<boolean> {
    if (!email) {
      return throwError(() => new Error('Email is required'));
    }
    return this.http.get<boolean>(`${this.baseUrl}/check-email?email=${email}`);
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
  getUser(): User | null {
    // Si vous utilisez un token JWT, vous pouvez extraire l'ID et autres informations du token
    const userData = localStorage.getItem('user'); // Exemple de stockage dans localStorage
    if (userData) {
      this.user = JSON.parse(userData); // On charge l'utilisateur depuis le localStorage
    }
    return this.user;
  }
  // Méthode pour récupérer l'ID utilisateur
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;  // Convertir en nombre
  }
  
  
  login(authRequest: AuthenticationRequest) {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, authRequest).pipe(
      tap((response: AuthenticationResponse) => {
        const accessToken = response.accessToken;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
  
        // Enregistrez l'ID de l'utilisateur dans localStorage
        if (response.userId) {
          localStorage.setItem('userId', response.userId.toString());  // Enregistrer l'ID utilisateur
        }
  
        if (response.first_name && response.last_name) {
          localStorage.setItem('firstName', response.first_name);
          localStorage.setItem('lastName', response.last_name);
        }
  
        if (response.role) {
          localStorage.setItem('role', response.role);
        }
  
        if (response.email_address) {
          localStorage.setItem('email', response.email_address);
        }
      })
    );
  }
  
  

  verifyCode(VerificationRequest: VerificationRequest) {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/verify`, VerificationRequest);
  }



  logout() {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    this.http.post('http://localhost:9090/api/v1/auth/logout', {}, {
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

  

  private jwtHelper = new JwtHelperService();

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token'); // Supposons que le token est stocké ici
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.userId || null;
    }
    return null;
  }

}
