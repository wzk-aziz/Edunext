import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GitService {
  private githubApiUrl = 'https://api.github.com';

  constructor(private http: HttpClient) { }

  // Récupère le sha du fichier si déjà existant
  getFileSha(
    owner: string,
    repo: string,
    path: string,
    token: string = environment.githubToken
  ): Observable<string | null> {
    const url = `${this.githubApiUrl}/repos/${owner}/${repo}/contents/${path}`;
    return this.http.get<any>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    }).pipe(
      map(response => response.sha as string),
      catchError(err => {
        // Si 404 => le fichier n'existe pas => return null
        if (err.status === 404) {
          return of(null);
        }
        console.error('GitHub SHA retrieval error:', err);
        throw err;
      })
    );
  }

  // Crée ou met à jour un fichier
  pushFileToGithub(
    owner: string,
    repo: string,
    path: string,
    content: string,
    commitMessage: string,
    token: string = environment.githubToken,
    sha?: string
  ): Observable<any> {
    const url = `${this.githubApiUrl}/repos/${owner}/${repo}/contents/${path}`;

    const body: any = {
      message: commitMessage,
      content: btoa(content), // encodage du contenu en base64
      committer: {
        name: 'Your Name',
        email: 'your-email@example.com'
      }
    };

    if (sha) {
      body.sha = sha; // nécessaire pour mettre à jour
    }

    return this.http.put<any>(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    }).pipe(
      catchError(error => {
        console.error('GitHub push error:', error);
        throw error;
      })
    );
  }
}