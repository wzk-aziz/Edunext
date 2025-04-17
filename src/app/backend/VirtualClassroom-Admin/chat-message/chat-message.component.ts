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

  // Api URL for direct testing
  private apiUrl = 'http://localhost:9090/api/chatMessages';

  constructor(private chatMessageService: ChatMessageService) {}

  ngOnInit(): void {
    this.fetchChatMessages();
  }

  fetchChatMessages(): void {
    this.loading = true;
    this.error = null;
    
    this.chatMessageService.getAllChatMessages().subscribe({
      next: (data) => {
        this.processChatMessages(data);
      },
      error: (err) => {
        console.error('Failed to fetch chat messages:', err);
        this.error = `Failed to fetch chat messages: ${err.message}`;
        this.loading = false;
        
        // Fall back to direct fetch
        this.debugFetchChatMessages();
      }
    });
  }
  
  processChatMessages(data: ChatMessage[]): void {
    this.chatMessages = Array.isArray(data) ? data : [];
    this.filterChatMessages();
    this.loading = false;
  }

  debugFetchChatMessages(): void {
    console.log('Debug fetch chat messages called');
    this.loading = true;
    this.error = null;
    
    // Use vanilla fetch to bypass Angular's HTTP client
    fetch(`${this.apiUrl}/all`)
      .then(response => response.text())
      .then(text => {
        console.log('Raw text sample:', text.substring(0, 200));
        
        // Very aggressive cleaning approach
        let cleanedJson = text
          // Remove all circular references
          .replace(/,"session":\{[^}]*\}/g, ',"session":null')
          .replace(/,"feedbacks":\[[^\]]*\]/g, ',"feedbacks":[]')
          .replace(/,"instructor":\{[^}]*\}/g, ',"instructor":null')
          .replace(/,"session":}/g, '}');
          
        try {
          const data = JSON.parse(cleanedJson);
          console.log('Data parsed successfully:', data.length, 'items');
          this.chatMessages = data;
          this.filterChatMessages();
        } catch (e) {
          console.error('Failed to parse even with cleaning:', e);
          // Last resort - extract just the minimal data we need
          this.extractChatMessagesWithRegex(text);
        }
        
        this.loading = false;
      })
      .catch(error => {
        this.error = `Failed to fetch: ${error.message}`;
        this.loading = false; 
      });
  }
  
  extractChatMessagesWithRegex(text: string): void {
    console.log('Extracting chat messages using regex');
    
    // Use a map to deduplicate by ID
    const messageMap = new Map();
    
    // Extract message IDs
    const idRegex = /\"idChatMessage\":(\d+)/g;
    let idMatch;
    const ids = [];
    
    while ((idMatch = idRegex.exec(text)) !== null) {
      ids.push(parseInt(idMatch[1]));
    }
    
    console.log('Found', ids.length, 'potential message IDs');
    
    // Process each ID
    ids.forEach(id => {
      if (messageMap.has(id)) return; // Skip duplicates
      
      // Find the message context
      const messageIndex = text.indexOf(`"idChatMessage":${id}`);
      if (messageIndex === -1) return;
      
      // Extract content around this message
      const startIdx = Math.max(0, messageIndex - 100);
      const endIdx = Math.min(text.length, messageIndex + 400);
      const messageContext = text.substring(startIdx, endIdx);
      
      // Extract fields
      let content = '';
      let sessionId = 0;
      
      const contentMatch = /"contentChatMessage":"([^"]*)"/g.exec(messageContext);
      if (contentMatch) content = contentMatch[1];
      
      const sessionMatch = /"session":\{"idSession":(\d+)/g.exec(messageContext);
      if (sessionMatch) sessionId = parseInt(sessionMatch[1]);
      else {
        // Try alternative session format
        const simpleSessionMatch = /"session":(\d+)/g.exec(messageContext);
        if (simpleSessionMatch) sessionId = parseInt(simpleSessionMatch[1]);
      }
      
      // Create message object
      messageMap.set(id, {
        idChatMessage: id,
        contentChatMessage: content,
        session: sessionId
      });
    });
    
    // Convert map to array
    const extractedMessages = Array.from(messageMap.values());
    console.log('Extracted', extractedMessages.length, 'chat messages');
    
    if (extractedMessages.length > 0) {
      this.chatMessages = extractedMessages;
      this.filterChatMessages();
    } else {
      this.error = 'Could not extract any chat messages from response';
    }
  }
  
  testDirectFetch(): void {
    this.loading = true;
    this.error = null;
    
    const testData = {
      contentChatMessage: "Test message",
      session: { idSession: 1 }
    };
    
    // Test different possible POST endpoints
    const endpoints = [
      { url: `${this.apiUrl}`, name: "POST to /api/chatMessages" },
      { url: `${this.apiUrl}/`, name: "POST to /api/chatMessages/" },
      { url: `${this.apiUrl}/add`, name: "POST to /api/chatMessages/add" },
      { url: `${this.apiUrl}/create`, name: "POST to /api/chatMessages/create" }
    ];
    
    let results = "Testing POST endpoints:\n\n";
    
    this.testApiEndpoint(endpoints, 0, results, testData)
      .then(finalResults => {
        console.log(finalResults);
        this.error = finalResults;
        this.loading = false;
      });
  }
  
  private testApiEndpoint(endpoints: any[], index: number, results: string, data: any): Promise<string> {
    if (index >= endpoints.length) {
      return Promise.resolve(results);
    }
    
    const endpoint = endpoints[index];
    return fetch(endpoint.url, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => {
      const result = `${endpoint.name}: ${response.ok ? 'SUCCESS' : 'FAILED'} (${response.status})\n`;
      console.log(result);
      return this.testApiEndpoint(endpoints, index + 1, results + result, data);
    })
    .catch(error => {
      const result = `${endpoint.name}: ERROR - ${error.message}\n`;
      console.error(result);
      return this.testApiEndpoint(endpoints, index + 1, results + result, data);
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
      filtered = filtered.filter(msg => {
        if (typeof msg.session === 'object' && msg.session !== null) {
          return msg.session.idSession === this.filters.sessionId;
        } else {
          return msg.session === this.filters.sessionId;
        }
      });
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

  // The rest of your component methods remain unchanged
  // Add new message, update message, delete message, etc.

  // Add chat message
  addChatMessage(): void {
    this.loading = true;
    
    // Format session properly for API
    const messageToCreate = {
      contentChatMessage: this.newChatMessage.contentChatMessage,
      session: typeof this.newChatMessage.session === 'number' 
        ? { idSession: this.newChatMessage.session } 
        : this.newChatMessage.session
    };
    
    console.log('Creating message:', messageToCreate);
    
    // Direct fetch for more control
    fetch(this.apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(messageToCreate)
    })
    .then(response => {
      console.log('Add response status:', response.status);
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Failed: ${response.status} ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Add successful, response:', data);
      this.chatMessages.push(data);
      this.clearSelection();
      this.filterChatMessages();
      this.loading = false;
    })
    .catch(error => {
      console.error('Add failed:', error);
      this.error = `Add failed: ${error.message}`;
      this.loading = false;
    });
  }
  
  // Rest of your methods remain the same...
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
    
    const messageToUpdate = {
      idChatMessage: this.selectedChatMessage.idChatMessage,
      contentChatMessage: this.selectedChatMessage.contentChatMessage,
      session: typeof this.selectedChatMessage.session === 'number' 
        ? { idSession: this.selectedChatMessage.session } 
        : this.selectedChatMessage.session
    };
    
    // Direct fetch for more control
    fetch(`${this.apiUrl}/${messageToUpdate.idChatMessage}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(messageToUpdate)
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Failed: ${response.status} ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      const index = this.chatMessages.findIndex(msg => msg.idChatMessage === data.idChatMessage);
      if (index !== -1) {
        this.chatMessages[index] = data;
      }
      this.clearSelection();
      this.filterChatMessages();
      this.loading = false;
    })
    .catch(error => {
      console.error('Update failed:', error);
      this.error = `Update failed: ${error.message}`;
      this.loading = false;
    });
  }

  async deleteChatMessage(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this chat message?')) {
      return;
    }
    
    this.loading = true;
    
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed: ${response.status} ${text}`);
      }
      
      this.chatMessages = this.chatMessages.filter(msg => msg.idChatMessage !== id);
      this.filterChatMessages();
    } catch (error: any) {
      console.error('Delete failed:', error);
      this.error = `Delete failed: ${error.message}`;
    } finally {
      this.loading = false;
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