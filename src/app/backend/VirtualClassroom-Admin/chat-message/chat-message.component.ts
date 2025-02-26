import { Component, OnInit } from '@angular/core';
import { ChatMessageService } from '../VirtualClassroom-Services/chat-message.service';
import { ChatMessage } from './chat-message.model';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  chatMessages: ChatMessage[] = [];
  filteredChatMessages: ChatMessage[] = [];
  paginatedChatMessages: ChatMessage[] = [];
  newChatMessage: ChatMessage = { 
    contentChatMessage: '', 
    session: 0 
  };
  selectedChatMessage: ChatMessage | null = null;
  
  // UI state
  showCreateForm = false;
  showSessionList = true;
  loading = false;
  error: string | null = null;
  
  // Search and filters
  searchTerm = '';
  filters = {
    sessionId: null as number | null
  };
  
  // Pagination
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 50];
  Math = Math; // For template access

  constructor(private chatMessageService: ChatMessageService) {}

  ngOnInit(): void {
    this.fetchChatMessages();
  }

  fetchChatMessages(): void {
    this.loading = true;
    this.error = null;
    
    this.chatMessageService.getAllChatMessages().subscribe({
      next: (data) => {
        this.chatMessages = data;
        this.filterChatMessages();
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to fetch chat messages: ${err.message}`;
        this.loading = false;
      }
    });
  }

  filterChatMessages(): void {
    let filtered = [...this.chatMessages];
    
    // Apply search term
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.contentChatMessage.toLowerCase().includes(search) || 
        msg.session.toString().includes(search)
      );
    }
    
    // Apply session filter
    if (this.filters.sessionId) {
      filtered = filtered.filter(msg => msg.session === this.filters.sessionId);
    }
    
    this.filteredChatMessages = filtered;
    this.currentPage = 1;
    this.paginate();
  }

  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedChatMessages = this.filteredChatMessages.slice(startIndex, endIndex);
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.filteredChatMessages.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.paginate();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filters.sessionId = null;
    this.filterChatMessages();
  }

  // Show form for adding a chat message
  showAddChatMessageForm(): void {
    this.showCreateForm = true;
    this.showSessionList = false;
    this.selectedChatMessage = null;
  }

  // Create a new chat message
  addChatMessage(): void {
    this.loading = true;
    
    this.chatMessageService.createChatMessage(this.newChatMessage).subscribe({
      next: (data) => {
        this.chatMessages.push(data);
        this.clearSelection();
        this.filterChatMessages();
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to create chat message: ${err.message}`;
        this.loading = false;
      }
    });
  }

  // Select a chat message for editing
  editChatMessage(chatMessage: ChatMessage): void {
    this.selectedChatMessage = { ...chatMessage };
    this.showSessionList = false;
    this.showCreateForm = false;
  }

  // Update a chat message
  updateChatMessage(): void {
    if (!this.selectedChatMessage) return;
    
    this.loading = true;
    
    this.chatMessageService.updateChatMessage(this.selectedChatMessage).subscribe({
      next: (data) => {
        const index = this.chatMessages.findIndex(msg => msg.idChatMessage === data.idChatMessage);
        if (index !== -1) {
          this.chatMessages[index] = data;
        }
        this.clearSelection();
        this.filterChatMessages();
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to update chat message: ${err.message}`;
        this.loading = false;
      }
    });
  }

  // Delete a chat message
  deleteChatMessage(id: number): void {
    if (confirm('Are you sure you want to delete this chat message?')) {
      this.loading = true;
      
      this.chatMessageService.deleteChatMessage(id).subscribe({
        next: () => {
          this.chatMessages = this.chatMessages.filter(msg => msg.idChatMessage !== id);
          this.filterChatMessages();
          this.loading = false;
        },
        error: (err) => {
          this.error = `Failed to delete chat message: ${err.message}`;
          this.loading = false;
        }
      });
    }
  }

  // Clear selection and reset view
  clearSelection(): void {
    this.selectedChatMessage = null;
    this.showCreateForm = false;
    this.showSessionList = true;
    this.newChatMessage = { contentChatMessage: '', session: 0 };
  }

  
}