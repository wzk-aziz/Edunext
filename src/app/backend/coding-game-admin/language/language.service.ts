import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Language } from '../models/language.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private baseUrl = `${environment.apiUrl}/languages`; // URL centralisée

  constructor(private http: HttpClient) {}

  // ✅ Récupérer un seul langage par ID
  get(id: number): Observable<Language> {
    return this.http.get<Language>(`${this.baseUrl}/${id}`);
  }

  // ✅ Récupérer tous les langages
  getAll(): Observable<Language[]> {
    return this.http.get<Language[]>(this.baseUrl);
  }

  // ✅ Ajouter un nouveau langage
  create(language: Language): Observable<Language> {
    return this.http.post<Language>(this.baseUrl, language);
  }

  // ✅ Mettre à jour un langage existant
  update(id: number, language: Language): Observable<Language> {
    return this.http.put<Language>(`${this.baseUrl}/${id}`, language);
  }

  // ✅ Supprimer un langage par ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
