import { Component, OnInit } from '@angular/core';
import { SessionService } from '../VirtualClassroom-Services/session.service';
import { Session } from './session.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  displayedColumns: string[] = ['id_session', 'title_session', 'session_duration', 'start_time', 'session_subject', 'instructor_id', 'actions'];
  sessions: Session[] = [];
  filteredSessions: Session[] = [];
  newSession: Session = {
    titleSession: '',
    sessionDuration: 0,
    startTime: new Date(),
    sessionSubject: '',
    instructor: 0
  };
  startTimeString: string = ''; // For datetime-local input
  selectedSession: Session | null = null;
  selectedStartTimeString: string = ''; // For datetime-local input in edit form
  showSessionList = true;
  showAddForm = false;
  searchTerm: string = '';
  loading: boolean = false;
  error: string | null = null;
  
  currentPage: number = 1;
pageSize: number = 5;
pageSizeOptions: number[] = [5, 10, 25, 50];
paginatedSessions: Session[] = [];
Math = Math; // For template access

// For filtering
filters: {
  subject: string | null;
  minDuration: number | null;
  maxDuration: number | null;
  dateFrom: Date | null;
  dateTo: Date | null;
} = {
  subject: null,
  minDuration: null,
  maxDuration: null,
  dateFrom: null,
  dateTo: null
};
availableSubjects: string[] = [];



  constructor(private sessionService: SessionService) {
    // Format the current date for the datetime-local input
    const now = new Date();
    this.startTimeString = this.formatDateForInput(now);
  }

  ngOnInit(): void {
    console.log('Component initialized');
    this.fetchSessions();
  }

  // Helper method to format date for datetime-local input
  formatDateForInput(date: Date): string {
    // Format: YYYY-MM-DDThh:mm
    return date.toISOString().slice(0, 16);
  }
  
  // Convert string from input to Date object
  parseInputDate(dateString: string): Date {
    return new Date(dateString);
  }

fetchSessions() {
  this.loading = true;
  this.error = null;
  console.log('Fetching sessions...');
  
  this.sessionService.getSessions().subscribe({
    next: (data: Session[]) => {
      console.log('Sessions received:', data);

  
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        this.error = 'Invalid data format received from server';
        this.loading = false;
        return;
      }
      
      // Process dates if needed
      this.sessions = data.map(session => {
        // Ensure startTime is a Date object (if it's a string)
        if (typeof session.startTime === 'string' && session.startTime) {
          return {
            ...session,
            startTime: new Date(session.startTime)  // Update existing property, don't create a new one
          };
        }
        return session;
      });
      
      this.filteredSessions = [...this.sessions];
      this.extractFilters(); // Add this
      this.paginate(); // Add this     
      this.loading = false;
      console.log('Sessions loaded:', this.sessions.length);
    },
    error: (error) => {
      console.error('Failed to fetch sessions:', error);
      this.error = 'Failed to load sessions. Please try again.';
      this.loading = false;
    }
  });
}

filterSessions() {
  // Reset filter if no search term
  if (!this.searchTerm) {
    this.filteredSessions = this.applyFilters([...this.sessions]);
  } else {
    const search = this.searchTerm.toLowerCase();
    const filtered = this.sessions.filter(session => {
      // Search across multiple fields
      return (
        session.titleSession?.toLowerCase().includes(search) ||
        session.sessionSubject?.toLowerCase().includes(search) ||
        (session.instructor?.toString() || '').includes(search) ||
        (session.sessionDuration?.toString() || '').includes(search) ||
        (session.startTime && new Date(session.startTime).toLocaleDateString().includes(search))
      );
    });
    
    // Apply any active filters after search
    this.filteredSessions = this.applyFilters(filtered);
  }
  
  this.currentPage = 1; // Reset to first page when searching
  this.paginate(); // Apply pagination
}

// Add these methods after filterSessions()
applyFilters(sessions: Session[]): Session[] {
  let result = [...sessions];
  
  // Filter by subject
  if (this.filters.subject) {
    result = result.filter(session => 
      session.sessionSubject === this.filters.subject
    );
  }
  
  // Filter by duration range
  if (this.filters.minDuration !== null) {
    result = result.filter(session => 
      session.sessionDuration >= this.filters.minDuration!
    );
  }
  
  if (this.filters.maxDuration !== null) {
    result = result.filter(session => 
      session.sessionDuration <= this.filters.maxDuration!
    );
  }
  
  // Filter by date range
  if (this.filters.dateFrom) {
    const fromDate = new Date(this.filters.dateFrom);
    fromDate.setHours(0, 0, 0, 0);
    result = result.filter(session => {
      if (!session.startTime) return false;
      return new Date(session.startTime) >= fromDate;
    });
  }
  
  if (this.filters.dateTo) {
    const toDate = new Date(this.filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    result = result.filter(session => {
      if (!session.startTime) return false;
      return new Date(session.startTime) <= toDate;
    });
  }
  
  return result;
}

// Method to extract available filters from data
extractFilters() {
  // Extract unique subjects
  this.availableSubjects = Array.from(new Set(
    this.sessions
      .map(session => session.sessionSubject)
      .filter(Boolean) as string[]
  ));
}

clearFilters() {
  this.filters = {
    subject: null,
    minDuration: null,
    maxDuration: null,
    dateFrom: null,
    dateTo: null
  };
  this.searchTerm = '';
  this.filteredSessions = [...this.sessions];
  this.currentPage = 1;
  this.paginate();
}

// Add pagination methods
paginate() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedSessions = this.filteredSessions.slice(startIndex, endIndex);
}

nextPage() {
  const totalPages = Math.ceil(this.filteredSessions.length / this.pageSize);
  if (this.currentPage < totalPages) {
    this.currentPage++;
    this.paginate();
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.paginate();
  }
}

changePageSize(size: number) {
  this.pageSize = size;
  this.currentPage = 1; // Reset to first page
  this.paginate();
}

  showSessions() {
    this.showSessionList = true;
    this.showAddForm = false;
    this.selectedSession = null;
    this.fetchSessions();
  }

  showAddSessionForm() {
    this.showAddForm = true;
    this.showSessionList = false;
    this.selectedSession = null;
    this.error = null;
    
    // Reset the form with current date
    const now = new Date();
    this.startTimeString = this.formatDateForInput(now);
    this.newSession = {
      titleSession: '',
      sessionDuration: 0,
      startTime: now,
      sessionSubject: '',
      instructor: null
    };
  }

  addSession() {
    this.loading = true;
    this.error = null;
    
    // Create a MINIMAL object exactly like debugAdd() does
    const minimalSession = {
      titleSession: this.newSession.titleSession,
      sessionDuration: this.newSession.sessionDuration || 30,
      startTime: this.startTimeString ? new Date(this.startTimeString).toISOString() : new Date().toISOString(),
      sessionSubject: this.newSession.sessionSubject
      // Don't include instructor or other fields unless necessary
    };
    
    console.log('Adding session with minimal data:', minimalSession);
    
    // Use direct fetch like debugAdd() does since it's more reliable
    fetch('http://localhost:8088/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalSession)
    })
    .then(response => {
      console.log('Add response status:', response.status);
      if (!response.ok) {
        return response.text().then(text => {
          console.error('Error response body:', text);
          throw new Error(`HTTP error! Status: ${response.status}, Details: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Add successful, response:', data);
      this.sessions.push(data);
      this.filteredSessions = [...this.sessions];
      this.resetForm();
      this.loading = false;
      alert('Session added successfully!');
    })
    .catch(error => {
      console.error('Add failed:', error);
      this.error = `Add failed: ${error.message}`;
      this.loading = false;
    });
  }

  resetForm() {
    this.newSession = {
      titleSession: '',
      sessionDuration: 0,
      startTime: new Date(),
      sessionSubject: '',
      instructor: 0
    };
    this.startTimeString = this.formatDateForInput(new Date());
    this.showSessionList = true;
    this.showAddForm = false;
  }

  editSession(session: Session) {
    this.selectedSession = { ...session };
    // Format date for the edit form
    if (session.startTime) {
      this.selectedStartTimeString = this.formatDateForInput(
        session.startTime instanceof Date ? session.startTime : new Date(session.startTime)
      );
    }
    this.showAddForm = false;
    this.showSessionList = false;
  }

  updateSession() {
    if (!this.selectedSession) return;
    
    this.loading = true;
    this.error = null;
    
    // IMPORTANT: Use the EXACT SAME approach as debugUpdate
    const sessionToUpdate: Session = {
      ...this.selectedSession,
      startTime: this.parseInputDate(this.selectedStartTimeString)  // Use Date object, not ISO string
    };
    
    console.log('Updating session with data:', sessionToUpdate);
    
    fetch(`http://localhost:8088/api/sessions/${sessionToUpdate.idSession}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionToUpdate)  // Let JSON.stringify handle the Date conversion
    })
    .then(response => {
      console.log('Update response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Update successful, response:', data);
      this.debugData = data;
      this.fetchSessions();
      this.selectedSession = null;
      this.showSessionList = true;
      this.loading = false;
      alert('Session updated successfully!');
    })
    .catch(error => {
      console.error('Update failed:', error);
      this.error = `Update failed: ${error.message}`;
      this.debugData = { error: error.message };
      this.loading = false;
    });
  }

  deleteSession(idSession: number) {  // Changed parameter name to match property
    if (!idSession) {
      console.error('No session ID provided for deletion');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    this.loading = true;
    this.error = null;
    
    this.sessionService.deleteSession(idSession).subscribe({  // Pass consistent parameter
      next: () => {
        console.log('Session deleted successfully');
        this.sessions = this.sessions.filter(s => s.idSession !== idSession);
        this.filteredSessions = [...this.sessions];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error deleting session:', error);
        this.error = 'Failed to delete session. Please try again.';
        this.loading = false;
      }
    });
  }

  clearSelection() {
    this.selectedSession = null;
    this.showSessionList = true;
    this.showAddForm = false;
  }

// Add these properties
debugData: any = null;

// Add this method
testAPI() {
  this.loading = true;
  this.error = null;
  this.debugData = null;
  
  console.log('Testing API connection...');
  
  fetch('http://localhost:8088/api/sessions/all')
    .then(response => {
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return response.json();
    })
    .then(data => {
      console.log('API test successful, received:', data);
      this.debugData = data;
      this.loading = false;
      
      // If data exists but isn't showing in the table, apply it directly
      if (Array.isArray(data) && data.length > 0) {
        console.log('Data is an array with', data.length, 'items');
        this.sessions = data;
        this.filteredSessions = [...data];
        
        // Force Angular to detect changes
        this.error = null; // This will trigger change detection
      }
    })
    .catch(error => {
      console.error('API test failed:', error);
      this.error = `API test failed: ${error.message}`;
      this.debugData = { error: error.message };
      this.loading = false;
    });
}

testAlternativeAPI() {
  console.log('Testing alternative API endpoint...');
  
  fetch('http://localhost:8088/api/sessions')
    .then(response => response.json())
    .then(data => {
      console.log('Alternative API test successful, received:', data);
      this.debugData = data;
      
      // If data exists but isn't showing in the table, try manual assignment
      if (Array.isArray(data) && data.length > 0) {
        this.sessions = data;
        this.filteredSessions = [...data];
      }
    })
    .catch(error => {
      console.error('Alternative API test failed:', error);
      this.debugData = { 
        error: error.message,
        note: 'Both API endpoints failed. Please check server status.' 
      };
    });
}


// Add this method to your component
debugUpdate() {
  if (!this.selectedSession) return;
  
  console.log('Selected session:', this.selectedSession);
  console.log('Selected start time string:', this.selectedStartTimeString);
  
  const sessionToUpdate: Session = {
    ...this.selectedSession,
    startTime: this.parseInputDate(this.selectedStartTimeString)
  };
  
  console.log('Session to update:', sessionToUpdate);
  
  // Test the direct API call
  fetch(`http://localhost:8088/api/sessions/${sessionToUpdate.idSession}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionToUpdate)
  })
  .then(response => {
    console.log('Update response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Update successful, response:', data);
    this.debugData = data;
    alert('Update successful!');
    this.fetchSessions();
    this.selectedSession = null;
    this.showSessionList = true;
  })
  .catch(error => {
    console.error('Update failed:', error);
    this.error = `Update failed: ${error.message}`;
    this.debugData = { error: error.message };
  });
}

// Add this method to your component
debugAdd() {
  // Create the most minimal valid object
  const minimalSession = {
    titleSession: this.newSession.titleSession || "Test Session",
    sessionDuration: this.newSession.sessionDuration || 30,
    startTime: new Date().toISOString(),
    sessionSubject: this.newSession.sessionSubject || "Test Subject"
    // No instructor or other fields for now
  };
  
  console.log('Minimal session payload:', JSON.stringify(minimalSession));
  
  // Test the direct API call
  fetch('http://localhost:8088/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(minimalSession)
  })
  .then(response => {
    console.log('Add response status:', response.status);
    if (!response.ok) {
      return response.text().then(text => {
        console.error('Error response body:', text);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${text}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('Add successful, response:', data);
    this.debugData = data;
    alert('Session added successfully!');
  })
  .catch(error => {
    console.error('Add failed:', error);
    this.error = `Add failed: ${error.message}`;
    this.debugData = { error: error.message };
  });
}

// Add this to your component.ts
checkApiSchema() {
  fetch('http://localhost:8088/api/sessions/schema', { method: 'OPTIONS' })
    .then(response => response.text())
    .then(data => {
      console.log('API schema info:', data);
      this.debugData = { schema: data };
    })
    .catch(error => {
      console.error('Schema check failed:', error);
      // Try an alternative approach - make a test GET request
      this.testAPI();
    });
}



}