import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8050/api/v1/users';


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

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

}