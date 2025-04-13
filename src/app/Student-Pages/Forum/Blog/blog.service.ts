import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Blog } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = `${environment.forumApiUrl}/api/blogs`;

  // 🔹 Mock data pour le développement
  private mockArticles = [
    {
      id: 1,
      title: 'The Rise of Multi-Modal AI Systems in 2025',
      category: 'Artificial Intelligence',
      imageUrl: '/assets/images/ai-systems.jpg',
      previewText: 'Recent advancements in large language models have led to a new generation of AI systems capable of processing multiple data formats simultaneously. These multi-modal systems can analyze text, images, and audio to provide more comprehensive solutions...',
      date: new Date('2025-02-24'),
      views: 342,
      comments: 28
    },
    {
      id: 2,
      title: 'TypeScript 6.0: What\'s New and What You Need to Know',
      category: 'Web Development',
      imageUrl: '/assets/images/typescript.jpg',
      previewText: 'TypeScript 6.0 has been released with significant improvements to the type system, better performance, and new language features...',
      date: new Date('2025-02-20'),
      views: 276,
      comments: 15
    },
    {
      id: 3,
      title: 'Modern Security Practices for Web Applications in 2025',
      category: 'Cybersecurity',
      imageUrl: '/assets/images/security.jpg',
      previewText: 'With the increasing sophistication of cyber threats, implementing robust security measures for web applications is more important than ever...',
      date: new Date('2025-02-18'),
      views: 189,
      comments: 12
    }
  ];

  constructor(private http: HttpClient) {}

  /** 🔹 Récupérer tous les blogs */
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl).pipe(
      catchError(error => this.handleErrorWithDefaultValue<Blog[]>(error, []))
    );
  }

  /** 🔹 Récupérer les blogs d'un forum spécifique */
  getBlogsByForumId(forumId: number): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${environment.forumApiUrl}/api/forums/${forumId}/blogs`).pipe(
      catchError(error => this.handleErrorWithDefaultValue<Blog[]>(error, []))
    );
  }

  /** 🔹 Récupérer un blog par ID */
  getBlogById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching blog with id=${id}:`, error);
        return throwError(() => new Error(`Failed to fetch blog with id=${id}`));
      })
    );
  }

  /** 🔹 Ajouter un blog dans un forum */
  createBlog(forumId: number, blog: Blog): Observable<Blog> {
    return this.http.post<Blog>(`${environment.forumApiUrl}/api/forums/${forumId}/blogs`, blog).pipe(
      catchError(error => {
        console.error('Error creating blog:', error);
        return throwError(() => new Error('Failed to create blog'));
      })
    );
  }

  /** 🔹 Ajouter un nouveau blog */
  addBlog(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>(this.apiUrl, blog).pipe(
      catchError(error => {
        console.error('Error adding blog:', error);
        return throwError(() => new Error('Failed to add blog'));
      })
    );
  }

  /** 🔹 Mettre à jour un blog */
  updateBlog(id: number, blog: Blog): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}`, blog).pipe(
      catchError(error => {
        console.error(`Error updating blog with id=${id}:`, error);
        return throwError(() => new Error(`Failed to update blog with id=${id}`));
      })
    );
  }

  /** 🔹 Supprimer un blog */
  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting blog with id=${id}:`, error);
        return throwError(() => new Error(`Failed to delete blog with id=${id}`));
      })
    );
  }

  /** 🔹 Récupérer les articles mockés (pour le dev uniquement) */
  getArticles(): Observable<any[]> {
    return of(this.mockArticles);
  }

  /** 🔹 Récupérer un article mocké par ID */
  getArticleById(id: number): Observable<any> {
    const article = this.mockArticles.find(a => a.id === id);
    return of(article);
  }

  /** 🔹 Like un blog */
  likeBlog(id: number): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/${id}/like`, {}).pipe(
      catchError(error => {
        console.error(`Error liking blog with id=${id}:`, error);
        return throwError(() => new Error(`Failed to like blog with id=${id}`));
      })
    );
  }

  /** 🔹 Ajouter un commentaire à un blog */
  addComment(blogId: number, comment: { content: string }): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/${blogId}/comments`, comment).pipe(
      catchError(error => {
        console.error(`Error adding comment to blog with id=${blogId}:`, error);
        return throwError(() => new Error(`Failed to add comment to blog with id=${blogId}`));
      })
    );
  }

  /**
   * Gestion des erreurs avec valeur par défaut
   * @param error L'erreur HTTP
   * @param defaultValue Valeur à retourner en cas d'erreur
   * @returns Observable avec la valeur par défaut
   */
  private handleErrorWithDefaultValue<T>(error: HttpErrorResponse, defaultValue: T): Observable<T> {
    this.logError(error);
    return of(defaultValue);
  }

  /**
   * Log d'erreur
   * @param error L'erreur à logger
   */
  private logError(error: HttpErrorResponse): void {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Erreur serveur: Code ${error.status}, Message: ${error.message}`;
      if (error.error && typeof error.error === 'object') {
        errorMessage += `, Détails: ${JSON.stringify(error.error)}`;
      }
    }
    
    console.error(errorMessage);
  }
}