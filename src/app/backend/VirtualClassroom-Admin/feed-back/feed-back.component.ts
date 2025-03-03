import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FeedBackService } from '../VirtualClassroom-Services/feed-back.service';
import { Feedback } from './feed-back.model';

@Component({
  selector: 'app-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.css']
})
export class FeedBackComponent implements OnInit {
  // Core properties
  feedbacks: Feedback[] = [];
  filteredFeedbacks: Feedback[] = [];
  paginatedFeedbacks: Feedback[] = [];
  selectedFeedback: any = null;
  newFeedback: any = {
    contentFeedback: '',
    rating: 0,
    session: null
  };
  
  // UI state properties
  loading = false;
  error: string | null = null;
  showAddForm = false;
  showFeedbackList = true;
  
  // API endpoint
  apiUrl = 'http://localhost:8088/api/feedbacks';
  
  // For template use
  Math = Math; // Expose Math for template calculations
  
  // Search and filtering
  searchTerm = '';
  filters = {
    minRating: null as number | null,
    maxRating: null as number | null,
    sessionId: null as number | null
  };
  
  // Pagination properties
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 50];

  // Add these properties to your component class
@ViewChild('confettiCanvas') confettiCanvas: ElementRef | undefined;
formSubmitted = false;
toasts: Array<{message: string, type: 'success' | 'error' | 'info' | 'warning'}> = [];

  
  constructor(private feedbackService: FeedBackService) {}
  
  ngOnInit(): void {
    this.fetchFeedbacks();
  }
  
  fetchFeedbacks(): void {
    this.loading = true;
    this.error = null;
    
    // Use direct fetch with text processing to handle malformed JSON
    fetch(`${this.apiUrl}/all`)
      .then(response => response.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          console.log('API returned data count:', data.length);
          console.log('First few items:', data.slice(0, 3));
          this.processFeedbacks(data);
        } catch (e) {
          console.error('JSON parse error:', e);
          
          // Try to clean the JSON
          const cleaned = this.cleanJsonText(text);
          try {
            const data = JSON.parse(cleaned);
            this.processFeedbacks(data);
          } catch (e2) {
            console.error('Failed to parse cleaned JSON:', e2);
            this.error = 'Failed to process feedback data';
            this.loading = false;
          }
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        this.error = `Failed to fetch feedbacks: ${error.message}`;
        this.loading = false;
      });
  }
  
  cleanJsonText(text: string): string {
    return text
      .replace(/,"session":\{"idSession":\d+,"session":/g, ',"session":{"idSession":')
      .replace(/,"feedbacks":\[.*?\]/g, '') // Remove feedbacks arrays
      .replace(/,"session":\{[^{}]*\}/g, ',"session":{"idSession":1}') // Replace session objects
      .replace(/,"session":}/g, '}') // Fix dangling session references
      .replace(/\}\]\}\}\]\}\}/g, '}]}]}]'); // Fix unclosed brackets
  }
  
  processFeedbacks(data: any[]): void {
    this.feedbacks = Array.isArray(data) ? data : [];
    
    // Add this line to normalize the data
    this.normalizeSessionIds();
    
    this.filterFeedbacks();
    this.loading = false;
  }
  
  // PAGINATION METHODS
  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.paginate();
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < Math.ceil(this.filteredFeedbacks.length / this.pageSize)) {
      this.currentPage++;
      this.paginate();
    }
  }
  
  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredFeedbacks.length);
    this.paginatedFeedbacks = this.filteredFeedbacks.slice(startIndex, endIndex);
  }
  
  // FILTERING METHODS
  filterFeedbacks(): void {
    let filtered = [...this.feedbacks];
    
    // Search term filtering
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(f => 
        (f.contentFeedback?.toLowerCase().includes(search)) || 
        (f.rating?.toString().includes(search))
      );
    }
    
    // Rating range filtering
    if (this.filters.minRating !== null) {
      filtered = filtered.filter(f => f.rating >= this.filters.minRating!);
    }
    
    if (this.filters.maxRating !== null) {
      filtered = filtered.filter(f => f.rating <= this.filters.maxRating!);
    }
    
    // Session ID filtering
    if (this.filters.sessionId !== null) {
      filtered = filtered.filter(f => {
        const sessionId = typeof f.session === 'object' ? f.session?.idSession : f.session;
        return sessionId === this.filters.sessionId;
      });
    }
    
    this.filteredFeedbacks = filtered;
    this.currentPage = 1; // Reset to first page
    this.paginate();
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.filters = {
      minRating: null,
      maxRating: null,
      sessionId: null
    };
    this.filterFeedbacks();
  }
  
  // FORM HANDLING
  showAddFeedbackForm(): void {
    this.showAddForm = true;
    this.showFeedbackList = false;
    this.selectedFeedback = null;
    this.formSubmitted = false; // Reset form submission flag

    this.newFeedback = {
      contentFeedback: '',
      rating: 0,
      session: null
    };
  }
  
  clearSelection(): void {
    this.selectedFeedback = null;
    this.showAddForm = false;
    this.showFeedbackList = true;
    this.formSubmitted = false; // Reset form submission flag

  }
  
  selectFeedbackForEdit(feedback: Feedback): void {
    // Clone the feedback object with proper handling of the session property
    const sessionValue = typeof feedback.session === 'object' 
      ? feedback.session.idSession 
      : feedback.session;
      
    this.selectedFeedback = { 
      ...feedback,
      // Store session as a simple number in the form
      session: sessionValue
    };
    
    this.showAddForm = false;
    this.showFeedbackList = false;
  }
  
  createFeedback(): void {
    this.formSubmitted = true; // Set this flag to show validation errors
    
    // Get reference to form and check validity
    const form = document.querySelector('form');
    if (form && form.checkValidity() === false) {
      this.showToast('Please fill in all required fields', 'warning');
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    const feedbackToCreate = {
      contentFeedback: this.newFeedback.contentFeedback.trim(),
      rating: Number(this.newFeedback.rating),
      session: {
        idSession: typeof this.newFeedback.session === 'number' 
          ? this.newFeedback.session 
          : Number(this.newFeedback.session)
      }
    };
    
    console.log('Creating feedback:', feedbackToCreate);
    
    fetch(`${this.apiUrl}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(feedbackToCreate)
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
      this.feedbacks.push(data);
      this.clearSelection();
      this.filterFeedbacks();
      this.loading = false;
      this.showToast('Feedback added successfully!', 'success');
      this.triggerConfetti(); // Add confetti animation
    })
    .catch(error => {
      console.error('Add failed:', error);
      this.error = `Add failed: ${error.message}`;
      this.loading = false;
      this.showToast(`Failed to add feedback: ${error.message}`, 'error');
    });
  }
  
  updateFeedback(): void {
    this.formSubmitted = true; // Set this flag to show validation errors
    
    if (!this.selectedFeedback || this.selectedFeedback.idFeedback === undefined) {
      this.error = "Cannot update feedback: invalid data";
      return;
    }
    
    // Get reference to form and check validity
    const form = document.querySelector('form');
    if (form && form.checkValidity() === false) {
      this.showToast('Please fill in all required fields', 'warning');
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    const feedbackToUpdate = {
      idFeedback: this.selectedFeedback.idFeedback,
      contentFeedback: this.selectedFeedback.contentFeedback.trim(),
      rating: Number(this.selectedFeedback.rating),
      session: {
        idSession: typeof this.selectedFeedback.session === 'number' 
          ? this.selectedFeedback.session 
          : Number(this.selectedFeedback.session)
      }
    };
    
    console.log('Updating feedback:', feedbackToUpdate);
    
    fetch(`${this.apiUrl}/${feedbackToUpdate.idFeedback}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackToUpdate)
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
      console.log('Update successful, response:', data);
      const index = this.feedbacks.findIndex(f => f.idFeedback === data.idFeedback);
      if (index !== -1) {
        this.feedbacks[index] = data;
      }
      this.clearSelection();
      this.filterFeedbacks();
      this.loading = false;
      this.showToast('Feedback updated successfully!', 'success');
      this.triggerConfetti(); // Add confetti animation
    })
    .catch(error => {
      console.error('Update failed:', error);
      this.error = `Update failed: ${error.message}`;
      this.loading = false;
      this.showToast(`Failed to update feedback: ${error.message}`, 'error');
    });
  }
  
// Update the deleteFeedback method
deleteFeedback(id: number | undefined): Promise<void> {
  if (id === undefined) {
    console.error('Cannot delete feedback with undefined ID');
    this.error = 'Cannot delete feedback: Missing ID';
    this.showToast('Cannot delete feedback: Missing ID', 'error');
    return Promise.resolve();
  }
  
  if (!confirm('Are you sure you want to delete this feedback?')) {
    return Promise.resolve();
  }
  
  this.loading = true;
  this.error = null;
  
  return fetch(`${this.apiUrl}/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(`Failed: ${response.status} ${text}`);
      });
    }
    
    this.feedbacks = this.feedbacks.filter(f => f.idFeedback !== id);
    this.filterFeedbacks();
    this.loading = false;
    this.showToast('Feedback deleted successfully!', 'success');
    return;
  })
  .catch(error => {
    console.error('Delete failed:', error);
    this.error = `Failed to delete feedback: ${error.message}`;
    this.loading = false;
    this.showToast(`Failed to delete feedback: ${error.message}`, 'error');
    return;
  });
}
  
  // DEBUGGING
  testFeedbackAPI(): void {
    this.loading = true;
    this.error = null;
    
    console.log('Testing feedback API endpoints...');
    
    // Create a more comprehensive API test
    const endpoints = [
      { url: `${this.apiUrl}/all`, method: 'GET', name: 'Get All Feedbacks' },
      { url: `${this.apiUrl}/add`, method: 'OPTIONS', name: 'Add Feedback OPTIONS' },
      { url: `${this.apiUrl}/1`, method: 'GET', name: 'Get Feedback by ID' }
    ];
    
    let results = '';
    
    // Test each endpoint sequentially
    this.testEndpoint(endpoints, 0, results)
      .then(finalResults => {
        console.log('API tests completed:', finalResults);
        this.loading = false;
      })
      .catch(error => {
        console.error('API tests failed:', error);
        this.error = `API tests failed: ${error.message}`;
        this.loading = false;
      });
  }
  
  private testEndpoint(endpoints: any[], index: number, results: string): Promise<string> {
    if (index >= endpoints.length) {
      return Promise.resolve(results);
    }
    
    const endpoint = endpoints[index];
    return fetch(endpoint.url, { method: endpoint.method })
      .then(response => {
        const result = `${endpoint.name} - ${response.ok ? 'SUCCESS' : 'FAILED'} (${response.status})`;
        console.log(result);
        return this.testEndpoint(endpoints, index + 1, results + result + '\n');
      })
      .catch(error => {
        const result = `${endpoint.name} - ERROR: ${error.message}`;
        console.error(result);
        return this.testEndpoint(endpoints, index + 1, results + result + '\n');
      });
  }

  // UTILITY METHODS
  getSessionId(session: any): string {
    if (session === null || session === undefined) {
      return 'None';
    }
    
    if (typeof session === 'object' && session.idSession !== undefined) {
      return session.idSession.toString();
    }
    
    if (typeof session !== 'object' && session !== null) {
      return session.toString();
    }
    
    return 'None';
  }
  
  // Method to generate star display for a rating
  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

    // Add this method to your component
  testDirectFetch(): void {
    this.loading = true;
    this.error = null;
    
    console.log('Testing direct fetch...');
    
    fetch('http://localhost:8088/api/feedbacks/all')
      .then(response => response.text())
      .then(text => {
        try {
          const raw = text.substring(0, 200) + "...";
          console.log("Raw response sample:", raw);
          
          const data = JSON.parse(text);
          console.log(`API returned ${data.length} items`);
          
          if (data.length > 0) {
            console.log("First item:", data[0]);
            if (data.length > 1) {
              console.log("Second item:", data[1]);
            }
          }
          
          // Show count directly in UI for easy debugging
          this.error = `API returned ${data.length} items. Check console for details.`;
        } catch (e) {
          console.error('Parse error:', e);
          this.error = 'Failed to parse API response';
        }
        this.loading = false;
      })
      .catch(error => {
        console.error('Fetch error:', error);
        this.error = `API test failed: ${error.message}`;
        this.loading = false;
      });
  }

  // Add these methods to your component class
showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  console.log('Showing toast:', message, type);
  
  // Clone the array for better change detection
  this.toasts = [...this.toasts, { message, type }];
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (this.toasts.length > 0) {
      this.toasts = this.toasts.slice(1);
    }
  }, 5000);
}

removeToast(index: number) {
  this.toasts = this.toasts.filter((_, i) => i !== index);
}

triggerConfetti() {
  if (!this.confettiCanvas) return;
  
  const canvas = this.confettiCanvas.nativeElement;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const pieces: any[] = [];
  const numberOfPieces = 200;
  const colors = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0'];

  function randomFromTo(from: number, to: number) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }
  
  for (let i = 0; i < numberOfPieces; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: randomFromTo(5, 10),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speed: randomFromTo(1, 5),
      friction: 0.95,
      opacity: 1,
      yVel: 0,
      xVel: 0
    });
  }
  
  let rendered = 0;
  
  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    pieces.forEach((piece, i) => {
      piece.opacity -= 0.01;
      piece.yVel += 0.25;
      piece.xVel *= piece.friction;
      piece.yVel *= piece.friction;
      piece.rotation += 1;
      piece.x += piece.xVel + Math.random() * 2 - 1;
      piece.y += piece.yVel;
      
      if (piece.opacity <= 0) {
        pieces.splice(i, 1);
        return;
      }
      
      ctx.beginPath();
      ctx.arc(piece.x, piece.y, piece.radius, 0, Math.PI * 2);
      ctx.fillStyle = piece.color;
      ctx.globalAlpha = piece.opacity;
      ctx.fill();
    });

    rendered += 1;
    if (pieces.length > 0 && rendered < 500) {
      requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  // Initialize confetti velocities
  pieces.forEach((piece) => {
    piece.xVel = (Math.random() - 0.5) * 20;
    piece.yVel = (Math.random() - 0.5) * 20;
  });
  
  renderConfetti();
}


// Add this method to your feed-back.component.ts
// Replace your normalizeSessionIds method with this
normalizeSessionIds(): void {
  console.log('Normalizing session IDs...');
  
  // Use type assertion to fix TypeScript errors
  this.feedbacks = this.feedbacks.map(feedback => {
    // Extract session ID
    let sessionId: number | null = null;
    
    if (feedback.session) {
      if (typeof feedback.session === 'object' && feedback.session.idSession !== undefined) {
        sessionId = feedback.session.idSession;
      } else if (typeof feedback.session === 'number') {
        sessionId = feedback.session;
      }
    }
    
    // Create a properly typed object that matches your interface
    return {
      ...feedback,
      session: {
        idSession: sessionId || 0
      },
      sessionId: sessionId
    } as Feedback;  // Type assertion to Feedback
  });
  
  console.log('After normalization, first feedback:', this.feedbacks[0]);
}




}