import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reaction } from '../models/reaction.model';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private baseUrl = 'http://localhost:9090/api/reaction';
  private currentUserEmail = 'amal.selmi@esprit.tn'; // Utilisateur local hardcodé
  
  // BehaviorSubject pour suivre les changements de réactions
  private reactionsSubject = new BehaviorSubject<Reaction[]>([]);
  public reactions$ = this.reactionsSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadAllReactions();
  }
  
  // Charger toutes les réactions au démarrage
  loadAllReactions(): void {
    this.http.get<Reaction[]>(`${this.baseUrl}/reactions`).subscribe(
      reactions => this.reactionsSubject.next(reactions),
      error => console.error('Erreur lors du chargement des réactions:', error)
    );
  }
  
  // Obtenir les réactions pour un thread spécifique
  getReactionsByThreadId(threadId: number): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.baseUrl}/threads/${threadId}/reactions`);
  }
  
  // Obtenir le nombre de réactions d'un type spécifique pour un thread
  getReactionCountByType(threadId: number, type: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/reactions/count/${threadId}/${type}`);
  }
  
  // Obtenir le nombre de commentaires pour un thread spécifique
  getCommentCountByThreadId(threadId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/reactions/comments/count/${threadId}`);
  }
  
  // Ajouter une réaction (like, love, etc.)
  addReaction(threadId: number, type: string): Observable<Reaction> {
    const reaction = {
      type: type,
      threadId: threadId,
      studentEmail: this.currentUserEmail,
      content: '' // Champ vide pour les réactions simples
    };
    
    console.log('Envoi de la réaction:', reaction); // Pour déboguer
    
    return this.http.post<Reaction>(`${this.baseUrl}/threads/${threadId}/reactions`, reaction)
      .pipe(
        tap(newReaction => {
          console.log('Réaction créée:', newReaction); // Pour déboguer
          const currentReactions = this.reactionsSubject.value;
          this.reactionsSubject.next([...currentReactions, newReaction]);
        })
      );
  }
  
  // Ajouter un commentaire
  addComment(threadId: number, content: string): Observable<Reaction> {
    const comment = {
      type: 'COMMENT',
      threadId: threadId,
      studentEmail: this.currentUserEmail,
      content: content // Utilisation de 'content' au lieu de 'reactionContent'
    };
    
    console.log('Envoi du commentaire:', comment); // Pour déboguer
    
    return this.http.post<Reaction>(`${this.baseUrl}/threads/${threadId}/reactions`, comment)
      .pipe(
        tap(newComment => {
          console.log('Commentaire créé:', newComment); // Pour déboguer
          const currentReactions = this.reactionsSubject.value;
          this.reactionsSubject.next([...currentReactions, newComment]);
        })
      );
  }
  
  // Supprimer une réaction
  deleteReaction(reactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reactions/${reactionId}`)
      .pipe(
        tap(() => {
          const currentReactions = this.reactionsSubject.value;
          this.reactionsSubject.next(
            currentReactions.filter(reaction => reaction.id !== reactionId)
          );
        })
      );
  }
  
  // Vérifier si l'utilisateur a déjà réagi avec un type spécifique
  hasUserReactedWithType(threadId: number, type: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/threads/${threadId}/reactions/check?email=${this.currentUserEmail}&type=${type}`
    );
  }
  
  // Récupérer l'ID de la réaction de l'utilisateur pour un thread et un type
  getUserReactionId(threadId: number, type: string): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/threads/${threadId}/reactions/user?email=${this.currentUserEmail}&type=${type}`
    );
  }
}