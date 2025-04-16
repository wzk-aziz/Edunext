import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

export interface BanStats {
  banned: number;
  notBanned: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8088/api/v1/users';
  


  constructor(private http: HttpClient) { }
  getAllUsers(): Observable<any[]> {  // Return an array explicitly
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
  

  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${role}`);
  }

  getUserById(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token
    console.log('Token utilisé:', token); // Vérification

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  getUserImage(fileName: string): string {
    return `http://localhost:8050/api/v1/auth/files/${fileName}`;
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${id}`, userData);
  }

  banUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/ban/${id}`, {});
  }
  
  unbanUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/unban/${id}`, {});
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getBanStatsByRole(role: string): Observable<BanStats> {
    return this.http.get<BanStats>(`${this.apiUrl}/stats/${role.toUpperCase()}`, {
      headers: this.getAuthHeaders()
    });
  }


  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${userId}`);
  }

  // Mettre à jour le profil de l'utilisateur
  updateUserProfile(userId: number, request: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${userId}`, request);
  }

  


  

}