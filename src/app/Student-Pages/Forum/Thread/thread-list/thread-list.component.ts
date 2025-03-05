import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Thread } from '../../models/thread.model';
import { Reaction } from '../../models/reaction.model';
import { ThreadService } from '../thread.service';
import { ReactionService } from '../reaction.service';

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent implements OnInit {
  threads: Thread[] = [];
  filteredThreads: Thread[] = [];
  reactions: Reaction[] = [];
  searchTerm: string = '';
  selectedTags: string[] = [];
  availableTags: string[] = [];
  forumId: number | null = null;
  reactionTypes: { type: 'LIKE' | 'LOVE' | 'HAHA' | 'COMMENT', label: string, icon: string, color: string }[] = [
    { type: 'LIKE', label: 'J\'aime',  icon: 'fa-thumbs-up',   color: '#2196f3' },
    { type: 'LOVE', label: 'J\'adore', icon: 'fa-heart',       color: '#e91e63' },
    { type: 'HAHA', label: 'Haha',    icon: 'fa-laugh-squint', color: '#ff9800' }
  ];
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  // Pour afficher/masquer la section commentaire pour chaque thread
  showCommentBox: { [threadId: number]: boolean } = {};

  // Contenu du nouveau commentaire par thread
  newCommentContent: { [threadId: number]: string } = {};

  // Current user
  currentUserEmail: string = 'current-user@example.com';

  constructor(
    private threadService: ThreadService,
    private reactionService: ReactionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['forumId']) {
        this.forumId = +params['forumId'];
        this.loadThreadsByForum();
      } else {
        this.loadAllThreads();
      }
    });
  }

  loadAllThreads(): void {
    this.threadService.getAllThreads().subscribe({
      next: (data) => {
        this.threads = data;
        this.filteredThreads = [...this.threads];
        this.calculateTotalPages();
        this.extractAllTags();
        this.loadAllReactions();
        
        // Initialiser les structures pour les commentaires
        this.threads.forEach(thread => {
          if (thread.id) {
            this.showCommentBox[thread.id] = false;
            this.newCommentContent[thread.id] = '';
          }
        });
      },
      error: (err) => console.error('Erreur lors du chargement des threads:', err)
    });
  }

  loadThreadsByForum(): void {
    if (this.forumId) {
      this.threadService.getThreadsByForumId(this.forumId).subscribe({
        next: (data) => {
          this.threads = data;
          this.filteredThreads = [...this.threads];
          this.calculateTotalPages();
          this.extractAllTags();
          this.loadAllReactions();
          
          // Initialiser les structures pour les commentaires
          this.threads.forEach(thread => {
            if (thread.id) {
              this.showCommentBox[thread.id] = false;
              this.newCommentContent[thread.id] = '';
            }
          });
        },
        error: (err) => console.error('Erreur lors du chargement des threads du forum:', err)
      });
    }
  }

  loadAllReactions(): void {
    this.reactionService.getAllReactions().subscribe({
      next: (data) => {
        this.reactions = data;
        // Mettre à jour les réactions sur les threads
        this.updateThreadsWithReactions();
      },
      error: (err) => console.error('Erreur lors du chargement des réactions:', err)
    });
  }

  // Ajouter cette méthode pour associer les réactions à leurs threads
  updateThreadsWithReactions(): void {
    this.threads.forEach(thread => {
      if (thread.id) {
        const threadReactions = this.reactions.filter(r => r.thread?.id === thread.id);
        thread.reactions = threadReactions;
      }
    });
  }

  extractAllTags(): void {
    const tagsSet = new Set<string>();
    this.threads.forEach(thread => {
      const tags = this.extractTags(thread.threadContent);
      tags.forEach(tag => tagsSet.add(tag));
    });
    this.availableTags = Array.from(tagsSet);
  }

  extractTags(content: string): string[] {
    const regex = /#(\w+)/g;
    const matches = content.match(regex) || [];
    return matches.map(tag => tag.substring(1));
  }

  addTag(tag: string): void {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
      this.filterThreads();
    }
  }

  removeTag(tag: string): void {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    this.filterThreads();
  }

  filterThreads(): void {
    this.filteredThreads = this.threads.filter(thread => {
      const matchesSearch = !this.searchTerm ||
        thread.threadTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        thread.threadContent.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let matchesTags = true;
      if (this.selectedTags.length > 0) {
        const threadTags = this.extractTags(thread.threadContent);
        matchesTags = this.selectedTags.every(tag => threadTags.includes(tag));
      }
      
      return matchesSearch && matchesTags;
    });
    this.calculateTotalPages();
    this.currentPage = 1;
  }

  sortThreads(sortBy: string): void {
    switch (sortBy) {
      case 'newest':
        this.filteredThreads.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        break;
      case 'oldest':
        this.filteredThreads.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        break;
      case 'popular':
        this.filteredThreads.sort(
          (a, b) => this.getReactionsCount(b, 'LIKE') - this.getReactionsCount(a, 'LIKE')
        );
        break;
      case 'active':
        this.filteredThreads.sort(
          (a, b) => this.getReactionsCount(b, 'COMMENT') - this.getReactionsCount(a, 'COMMENT')
        );
        break;
    }
  }

  getThreadPreview(content: string): string {
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  }

  getReactionsCount(thread: Thread, type: string): number {
    if (!thread.reactions) return 0;
    return thread.reactions.filter(r => r.reactionType === type).length;
  }

  // Méthode pour récupérer les commentaires d'un thread
  getThreadComments(thread: Thread): Reaction[] {
    if (!thread.reactions) return [];
    return thread.reactions.filter(r => r.reactionType === 'COMMENT');
  }

  hasReacted(threadId: number, type: string): boolean {
    if (threadId === 0) return false;
    return this.reactions.some(r => 
      r.thread?.id === threadId && 
      r.reactionType === type && 
      r.studentEmail === this.currentUserEmail
    );
  }

  toggleReaction(threadId: number, type: 'LIKE' | 'LOVE' | 'HAHA' | 'COMMENT'): void {
    if (!threadId) {
      console.error('Thread ID is undefined');
      return;
    }

    const existingReaction = this.reactions.find(r => 
      r.thread?.id === threadId &&
      r.reactionType === type &&
      r.studentEmail === this.currentUserEmail
    );

    if (existingReaction && existingReaction.id != null) {
      this.reactionService.deleteReaction(existingReaction.id).subscribe({
        next: () => {
          this.reactions = this.reactions.filter(r => r.id !== existingReaction.id);
          this.updateThreadsWithReactions(); // Update all threads with latest reactions
        },
        error: (err) => console.error('Erreur lors de la suppression de la réaction:', err)
      });
  
    } else {
      // Créer une nouvelle réaction
      const newReaction: Reaction = {
        id: null,
        reactionType: type,
        reactionContent: type === 'COMMENT' ? '' : type,
        studentEmail: this.currentUserEmail,
        thread: { id: threadId } as Thread
      };
      
      this.reactionService.createThreadReaction(threadId, newReaction).subscribe({
        next: (reaction) => {
          this.reactions.push(reaction);
          this.updateThreadReactions(threadId, type, true);
        },
        error: (err) => console.error('Erreur lors de la création de la réaction:', err)
      });
    }
  }

  // Afficher/Masquer la box de commentaires
  toggleCommentBox(thread: Thread): void {
    if (!thread.id) return;
    this.showCommentBox[thread.id] = !this.showCommentBox[thread.id];
  }

  // Ajouter un commentaire
  addComment(threadId: number): void {
    if (!threadId) {
      console.error('Thread ID is undefined');
      return;
    }
    
    const content = this.newCommentContent[threadId];
    if (!content || content.trim().length === 0) {
      console.error('Le contenu du commentaire est vide');
      return;
    }

    const newComment: Reaction = {
      id: null,
      reactionType: 'COMMENT',
      reactionContent: content,
      studentEmail: this.currentUserEmail,
      thread: { id: threadId } as Thread
    };

    this.reactionService.createThreadReaction(threadId, newComment).subscribe({
      next: (comment) => {
        // Mettre à jour la liste des réactions globales
        this.reactions.push(comment);
        // Mettre à jour directement dans l'objet Thread concerné
        this.updateThreadReactions(threadId, 'COMMENT', true, comment);
        // Vider le champ de commentaire
        this.newCommentContent[threadId] = '';
      },
      error: (err) => console.error('Erreur lors de l\'ajout du commentaire:', err)
    });
  }

  // Mise à jour des réactions d'un thread (Like ou Comment)
  updateThreadReactions(
    threadId: number, 
    type: string, 
    isAdd: boolean, 
    newReaction?: Reaction
  ): void {
    const thread = this.threads.find(t => t.id === threadId);
    if (thread) {
      if (!thread.reactions) {
        thread.reactions = [];
      }
      
      if (isAdd) {
        if (newReaction) {
          thread.reactions.push(newReaction);
        } else {
          thread.reactions.push({
            id: null,
            reactionType: type,
            reactionContent: type === 'COMMENT' ? '' : type,
            studentEmail: this.currentUserEmail
          } as Reaction);
        }
      } else {
        thread.reactions = thread.reactions.filter(r =>
          !(r.reactionType === type && r.studentEmail === this.currentUserEmail)
        );
      }
    }
  }

  // Pagination
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredThreads.length / this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getCurrentPageThreads(): Thread[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredThreads.slice(startIndex, endIndex);
  }
}