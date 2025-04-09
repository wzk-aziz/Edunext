import { Component, OnInit } from '@angular/core';
import { Thread } from '../../models/thread.model';
import { ThreadService } from '../thread.service';
import { ReactionService } from '../reaction.service';
import { Reaction } from '../../models/reaction.model';

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.scss']
})
export class ThreadListComponent implements OnInit {
  threads: Thread[] = [];
  filteredThreads: Thread[] = [];
  searchTerm: string = '';
  
  // État UI
  showCommentBox: { [key: number]: boolean } = {};
  newCommentContent: { [key: number]: string } = {};
  loadingReactions: { [key: number]: boolean } = {};
  
  // Pagination
  currentPage = 1;
  pageSize = 5;
  
  // Filtres et tri
  selectedTags: string[] = [];
  availableTags: string[] = ['angular', 'spring', 'java', 'typescript', 'javascript', 'html', 'css'];
  selectedSort = 'newest';
  sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'oldest', label: 'Plus anciens' },
    { value: 'mostComments', label: 'Plus commentés' },
    { value: 'mostLiked', label: 'Plus aimés' }
  ];
  
  // Types de réactions disponibles
 // Dans Angular, vos types doivent correspondre exactement aux noms des énumérations dans Spring
reactionTypes = [
  { type: 'LIKE', label: "J'aime", icon: 'fa-thumbs-up', color: '#4267B2' },
  { type: 'LOVE', label: "J'adore", icon: 'fa-heart', color: '#E91E63' },
  { type: 'HAHA', label: 'Haha', icon: 'fa-laugh', color: '#FFC107' }
];
  
  userReactions: { [threadId: number]: { [reactionType: string]: number } } = {};
  // Compteurs de réactions
  reactionCounts: { [threadId: number]: { [reactionType: string]: number } } = {};

  constructor(
    private threadService: ThreadService,
    private reactionService: ReactionService
  ) {}

  ngOnInit(): void {
    this.loadThreads();
    
    // S'abonner aux changements de réactions
    this.reactionService.reactions$.subscribe(() => {
      this.loadUserReactions();
      this.loadReactionCounts();
    });
  }

  loadThreads(): void {
    this.threadService.getAllThreads().subscribe(
      threads => {
        this.threads = threads;
        this.filterThreads();
        this.loadUserReactions();
        this.loadReactionCounts();
      },
      error => console.error('Erreur lors du chargement des threads:', error)
    );
  }
  
  loadUserReactions(): void {
    this.threads.forEach(thread => {
      if (!thread.id) return;
      
      this.reactionTypes.forEach(reaction => {
        this.reactionService.hasUserReactedWithType(thread.id!, reaction.type).subscribe(
          hasReacted => {
            if (hasReacted) {
              this.reactionService.getUserReactionId(thread.id!, reaction.type).subscribe(
                reactionId => {
                  if (!this.userReactions[thread.id!]) {
                    this.userReactions[thread.id!] = {};
                  }
                  this.userReactions[thread.id!][reaction.type] = reactionId;
                }
              );
            }
          }
        );
      });
    });
  }
  
  loadReactionCounts(): void {
    this.threads.forEach(thread => {
      if (!thread.id) return;
      
      // Initialiser le compteur pour ce thread
      if (!this.reactionCounts[thread.id]) {
        this.reactionCounts[thread.id] = {};
      }
      
      // Charger le nombre de chaque type de réaction
      this.reactionTypes.forEach(reaction => {
        this.reactionService.getReactionCountByType(thread.id!, reaction.type).subscribe(
          count => {
            this.reactionCounts[thread.id!][reaction.type] = count;
          },
          error => console.error(`Erreur lors du chargement du nombre de réactions ${reaction.type}:`, error)
        );
      });
      
      // Charger le nombre de commentaires
      this.reactionService.getCommentCountByThreadId(thread.id).subscribe(
        count => {
          this.reactionCounts[thread.id!]['COMMENT'] = count;
        },
        error => console.error('Erreur lors du chargement du nombre de commentaires:', error)
      );
    });
  }

  filterThreads(): void {
    // Filtrer par terme de recherche
    let filtered = this.threads;
    
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(thread => 
        thread.threadTitle.toLowerCase().includes(searchLower) || 
        thread.threadContent.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrer par tags sélectionnés
    if (this.selectedTags.length > 0) {
      filtered = filtered.filter(thread => {
        return this.selectedTags.some(tag => 
          thread.threadContent.includes(`#${tag}`)
        );
      });
    }
    
    // Appliquer le tri
    this.applySorting(filtered);
    
    this.filteredThreads = filtered;
  }
  
  applySorting(threads: Thread[]): void {
    switch (this.selectedSort) {
      case 'newest':
        threads.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case 'oldest':
        threads.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
      case 'mostComments':
        threads.sort((a, b) => {
          const aComments = this.reactionCounts[a.id || 0]?.['COMMENT'] || 0;
          const bComments = this.reactionCounts[b.id || 0]?.['COMMENT'] || 0;
          return bComments - aComments;
        });
        break;
      case 'mostLiked':
        threads.sort((a, b) => {
          const aLikes = this.reactionCounts[a.id || 0]?.['LIKE'] || 0;
          const bLikes = this.reactionCounts[b.id || 0]?.['LIKE'] || 0;
          return bLikes - aLikes;
        });
        break;
    }
  }
  
  sortThreads(sortValue: string): void {
    this.selectedSort = sortValue;
    this.filterThreads();
  }
  
  addTag(tag: string): void {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }
    this.filterThreads();
  }
  
  // Gestion des réactions
  hasReacted(threadId: number, reactionType: string): boolean {
    return !!(this.userReactions[threadId] && this.userReactions[threadId][reactionType]);
  }
  
  getReactionCount(threadId: number, reactionType: string): number {
    return this.reactionCounts[threadId]?.[reactionType] || 0;
  }
  
  toggleReaction(threadId: number, reactionType: string): void {
    if (this.hasReacted(threadId, reactionType)) {
      // Supprimer la réaction
      const reactionId = this.userReactions[threadId][reactionType];
      this.reactionService.deleteReaction(reactionId).subscribe(
        () => {
          delete this.userReactions[threadId][reactionType];
          // Décrémenter le compteur
          if (this.reactionCounts[threadId] && this.reactionCounts[threadId][reactionType] > 0) {
            this.reactionCounts[threadId][reactionType]--;
          }
        },
        error => console.error(`Erreur lors de la suppression de la réaction:`, error)
      );
    } else {
      // Ajouter la réaction
      this.reactionService.addReaction(threadId, reactionType).subscribe(
        newReaction => {
          if (!this.userReactions[threadId]) {
            this.userReactions[threadId] = {};
          }
          this.userReactions[threadId][reactionType] = newReaction.id!;
          
          // Incrémenter le compteur
          if (!this.reactionCounts[threadId]) {
            this.reactionCounts[threadId] = {};
          }
          if (!this.reactionCounts[threadId][reactionType]) {
            this.reactionCounts[threadId][reactionType] = 0;
          }
          this.reactionCounts[threadId][reactionType]++;
        },
        error => console.error(`Erreur lors de l'ajout de la réaction:`, error)
      );
    }
  }
  
  // Gestion des commentaires
  toggleCommentBox(thread: Thread): void {
    if (!thread.id) return;
    this.showCommentBox[thread.id] = !this.showCommentBox[thread.id];
    
    if (this.showCommentBox[thread.id]) {
      this.loadingReactions[thread.id] = true;
      this.reactionService.getReactionsByThreadId(thread.id).subscribe(
        reactions => {
          thread.reactions = reactions;
          if (thread.id !== undefined) {
            this.loadingReactions[thread.id] = false;
          }
        },
        error => console.error('Erreur lors du chargement des réactions:', error)
      );
    }
  }
  
// Add to thread-list-admin.component.ts

addComment(threadId: number): void {
  if (!this.newCommentContent[threadId]) return;
  
  this.loadingReactions[threadId] = true;
  this.reactionService.addComment(threadId, this.newCommentContent[threadId])
    .subscribe(
      comment => {
        // Update the thread's reactions
        const thread = this.threads.find(t => t.id === threadId);
        if (thread) {
          if (!thread.reactions) thread.reactions = [];
          thread.reactions.push(comment);
          
          // Update reaction counts
          if (!this.reactionCounts[threadId]) this.reactionCounts[threadId] = {};
          if (!this.reactionCounts[threadId]['COMMENT']) this.reactionCounts[threadId]['COMMENT'] = 0;
          this.reactionCounts[threadId]['COMMENT']++;
        }
        
        // Clear the input
        this.newCommentContent[threadId] = '';
        this.loadingReactions[threadId] = false;
      },
      error => {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
        this.loadingReactions[threadId] = false;
      }
    );
}
  
  getThreadComments(thread: Thread): Reaction[] {
    if (!thread.reactions) return [];
    return thread.reactions.filter(r => r.type === 'COMMENT');
  }
  
  // Pagination
  getCurrentPageThreads(): Thread[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredThreads.slice(startIndex, startIndex + this.pageSize);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredThreads.length / this.pageSize);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  // Utilitaires
  getThreadPreview(content: string): string {
    if (!content) return '';
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  }
  
  extractTags(content: string): string[] {
    if (!content) return [];
    const tags: string[] = [];
    this.availableTags.forEach(tag => {
      if (content.includes(`#${tag}`)) {
        tags.push(tag);
      }
    });
    return tags;
  }

  deleteThread(threadId: number): void {
    this.threadService.deleteThread(threadId).subscribe(
      () => {
        this.threads = this.threads.filter(thread => thread.id !== threadId);
        this.filterThreads();
      },
      error => console.error('Erreur lors de la suppression du thread:', error)
    );
  }
}