import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Certificate } from '../models/Certificate';


@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private apiUrl = 'http://localhost:9090/api/certificates';

  constructor(private http: HttpClient) {}

  updateCertificate(id: number, certificate: Certificate): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.apiUrl}/${id}`, certificate);
  }

  //  Supprimer un certificat
  deleteCertificate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getAllCertificate(): Observable<Certificate[]> {
      return this.http.get<Certificate[]>(this.apiUrl);
    }

  createCertificate(examId: number, certificate: Certificate): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.apiUrl}/${examId}`, certificate);
  }

  getCertificatesByExam(idExam: number): Observable<Certificate[]> {
    console.log(`Fetching certificates for exam ID: ${idExam}`); // Log l'ID de l'examen
    return this.http.get<Certificate[]>(`http://localhost:9090/api/certificates/exam/${idExam}`)
      .pipe(
        catchError(err => {
          console.error('Error fetching certificates:', err);
          return throwError(() => new Error(err));
        })
      );
  }
  

 // getCertificates(): Observable<Certificate[]> {
  //  return this.http.get<Certificate[]>(this.apiUrl);
//  }

  //getCertificate(id: number): Observable<Certificate> {
    //return this.http.get<Certificate>(`${this.apiUrl}/${id}`);
  //}

  //createCertificate(certificate: Certificate): Observable<Certificate> {
  //  return this.http.post<Certificate>(this.apiUrl, certificate);
//  }

  //updateCertificateAndAffectToExam(id: number, certificate: Certificate, idExam: number): Observable<Certificate> { 
    //return this.http.put<Certificate>(`${this.apiUrl}/${id}/affectToExam/${idExam}`, certificate);
  //}  

  //deleteCertificate(id: number): Observable<void> {
   // return this.http.delete<void>(`${this.apiUrl}/${id}`);
 // }
}
