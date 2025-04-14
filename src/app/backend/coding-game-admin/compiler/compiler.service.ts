import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compiler } from '../models/compiler.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompilerService {
  private baseUrl = `${environment.apiUrl}/compilers`; 

  constructor(private http: HttpClient) {}

  get(id: number): Observable<Compiler> {
    return this.http.get<Compiler>(`${this.baseUrl}/${id}`);
  }

  getAll(): Observable<Compiler[]> {
    return this.http.get<Compiler[]>(this.baseUrl);
  }

  create(compiler: Compiler): Observable<Compiler> {
    return this.http.post<Compiler>(this.baseUrl, compiler);
  }


  update(id: number, compiler: Compiler): Observable<Compiler> {
    return this.http.put<Compiler>(`${this.baseUrl}/${id}`, compiler);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
