import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = '/api/blog';

  // Mock data for development
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
      previewText: 'TypeScript 6.0 has been released with significant improvements to the type system, better performance, and new language features. This major update brings several quality-of-life improvements that will change how developers write and maintain TypeScript code...',
      date: new Date('2025-02-20'),
      views: 276,
      comments: 15
    },
    {
      id: 3,
      title: 'Modern Security Practices for Web Applications in 2025',
      category: 'Cybersecurity',
      imageUrl: '/assets/images/security.jpg',
      previewText: 'With the increasing sophistication of cyber threats, implementing robust security measures for web applications is more important than ever. Learn about the latest approaches to authentication, data encryption, and vulnerability testing that can protect your apps from emerging threats...',
      date: new Date('2025-02-18'),
      views: 189,
      comments: 12
    }
  ];

  constructor(private http: HttpClient) { }

  getArticles(): Observable<any[]> {
    // For development, use mock data
    // In production, uncomment the HTTP request
    return of(this.mockArticles);
    
    // Production code:
    // return this.http.get<any[]>(`${this.apiUrl}/articles`)
    //   .pipe(
    //     catchError(this.handleError('getArticles', []))
    //   );
  }

  getArticleById(id: number): Observable<any> {
    // For development, use mock data
    const article = this.mockArticles.find(a => a.id === id);
    return of(article);
    
    // Production code:
    // return this.http.get<any>(`${this.apiUrl}/articles/${id}`)
    //   .pipe(
    //     catchError(this.handleError<any>(`getArticle id=${id}`))
    //   );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Return empty result to keep app running
      return of(result as T);
    };
  }
}