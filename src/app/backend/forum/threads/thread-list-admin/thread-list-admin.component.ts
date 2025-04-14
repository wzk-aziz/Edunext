import { Component, OnInit } from '@angular/core';
import { Thread } from 'src/app/Student-Pages/Forum/models/thread.model';
import { ThreadService } from 'src/app/Student-Pages/Forum/Thread/thread.service';
import { ReactionService } from 'src/app/Student-Pages/Forum/Thread/reaction.service';
import { Reaction } from 'src/app/Student-Pages/Forum/models/reaction.model';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-thread-list-admin',
  templateUrl: './thread-list-admin.component.html',
  styleUrls: ['./thread-list-admin.component.css']
})
export class ThreadListAdminComponent implements OnInit {
  threads: Thread[] = [];
  filteredThreads: Thread[] = [];
  searchTerm: string = '';
  
  // UI state
  showCommentBox: { [key: number]: boolean } = {};
  loadingReactions: { [key: number]: boolean } = {};
  
  // Pagination
  currentPage = 1;
  pageSize = 5;
  
  // Filters and sorting
  selectedTags: string[] = [];
  availableTags: string[] = ['angular', 'spring', 'java', 'typescript', 'javascript', 'html', 'css'];
  selectedSort = 'newest';
  sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'oldest', label: 'Plus anciens' },
    { value: 'mostComments', label: 'Plus commentés' },
    { value: 'mostLiked', label: 'Plus aimés' }
  ];
  
  // Reaction types
  reactionTypes = [
    { type: 'LIKE', label: "J'aime", icon: 'fa-thumbs-up', color: '#4267B2' },
    { type: 'LOVE', label: "J'adore", icon: 'fa-heart', color: '#E91E63' },
    { type: 'HAHA', label: 'Haha', icon: 'fa-laugh', color: '#FFC107' }
  ];
  
  // Reaction counters
  reactionCounts: { [threadId: number]: { [reactionType: string]: number } } = {};

  constructor(
    private threadService: ThreadService,
    private reactionService: ReactionService
  ) {}

  ngOnInit(): void {
    this.loadThreads();
  }

  loadThreads(): void {
    this.threadService.getAllThreads().subscribe(
      threads => {
        this.threads = threads;
        this.filterThreads();
        this.loadReactionCounts();
      },
      error => console.error('Erreur lors du chargement des threads:', error)
    );
  }
  
  loadReactionCounts(): void {
    this.threads.forEach(thread => {
      if (!thread.id) return;
      
      // Initialize counter for this thread
      if (!this.reactionCounts[thread.id]) {
        this.reactionCounts[thread.id] = {};
      }
      
      // Load reaction counts for each reaction type
      this.reactionTypes.forEach(reaction => {
        this.reactionService.getReactionCountByType(thread.id!, reaction.type).subscribe(
          (count: number) => {
            this.reactionCounts[thread.id!][reaction.type] = count;
          },
          (error: any) => console.error(`Erreur lors du chargement des décomptes de réactions:`, error)
        );
      });
      
      // Load comment counts
      this.reactionService.getCommentCountByThreadId(thread.id!).subscribe(
        (count: number) => {
          this.reactionCounts[thread.id!]['COMMENT'] = count;
        },
        (error: any) => console.error(`Erreur lors du chargement des décomptes de commentaires:`, error)
      );
    });
  }

  filterThreads(): void {
    // Filter by search term
    let filtered = this.threads;
    
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(thread => 
        thread.threadTitle.toLowerCase().includes(searchLower) || 
        thread.threadContent.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by selected tags
    if (this.selectedTags.length > 0) {
      filtered = filtered.filter(thread => {
        return this.selectedTags.some(tag => 
          thread.threadContent.includes(`#${tag}`)
        );
      });
    }
    
    // Apply sorting
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
  
  // Get reaction count for a thread
  getReactionCount(threadId: number, reactionType: string): number {
    return this.reactionCounts[threadId]?.[reactionType] || 0;
  }
  
  // Comments management
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
  
  // Utilities
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
    if (confirm('Êtes-vous sûr de vouloir supprimer ce thread ? Cette action est irréversible.')) {
      this.threadService.deleteThread(threadId).subscribe(
        () => {
          this.threads = this.threads.filter(thread => thread.id !== threadId);
          this.filterThreads();
        },
        error => console.error('Erreur lors de la suppression du thread:', error)
      );
    }
  }
}