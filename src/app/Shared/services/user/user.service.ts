import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

}
