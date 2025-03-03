import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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

toasts: Array<{message: string, type: 'success' | 'error' | 'info' | 'warning'}> = [];

@ViewChild('confettiCanvas') confettiCanvas: ElementRef | undefined;


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
    this.loading = true;
    this.error = null;
    
    this.sessionService.getSessions().subscribe({
      next: (data) => {
        console.log('Received sessions:', data);
        
        // Process the data to ensure instructor IDs are extracted
        this.sessions = data.map(session => {
          // Extract instructor ID from various formats
          let instructorId = null;
          
          if (session.instructor) {
            if (typeof session.instructor === 'object') {
              instructorId = session.instructor.id || 
                            session.instructor.idInstructor || 
                            session.instructor.instructorId;
            } else if (typeof session.instructor === 'number') {
              instructorId = session.instructor;
            } else if (typeof session.instructor === 'string' && !isNaN(Number(session.instructor))) {
              instructorId = Number(session.instructor);
            }
          }
          
          // If we still don't have an instructorId, use existing if available
          if (instructorId === null && session.instructorId !== undefined) {
            instructorId = session.instructorId;
          }
          
          return {
            ...session,
            instructorId: instructorId,
            // CRITICAL CHANGE: Set instructor to be the numeric ID for consistency
            instructor: instructorId
          };
        });
        
        this.filteredSessions = [...this.sessions];
        this.extractFilters();
        this.paginate();
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load sessions:', error);
        this.error = 'Failed to load sessions. Please try again.';
        this.loading = false;
      }
    });
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

  // Replace your current fetchSessions() method with this:
  fetchSessions() {
    this.loading = true;
    this.error = null;
    console.log('Fetching sessions...');
    
    // First, try a direct fetch to see raw response
    fetch('http://localhost:8088/api/sessions/all')
      .then(response => response.text())
      .then(text => {
        console.log('Raw response sample:', text.substring(0, 200));
      })
      .catch(err => console.error('Raw fetch error:', err));
    
    // Then use the service
    this.sessionService.getSessions().subscribe({
      next: (data: Session[]) => {
        console.log('Sessions received:', data);
        
        // Extra step: ensure instructorId is always processed correctly
        this.sessions = data.map(session => {
          // Process any instructor data we find to ensure ID is set
          let instructorId = null;
          
          if (session.instructor) {
            if (typeof session.instructor === 'object') {
              instructorId = session.instructor.id || 
                            session.instructor.idInstructor || 
                            session.instructor.instructorId;
            } else if (typeof session.instructor === 'number') {
              instructorId = session.instructor;
            } else if (typeof session.instructor === 'string' && !isNaN(Number(session.instructor))) {
              instructorId = Number(session.instructor);
            }
          }
          
          // Use existing instructorId if provided
          if (session.instructorId !== undefined && session.instructorId !== null) {
            instructorId = session.instructorId;
          }
          
          return {
            ...session,
            instructorId: instructorId,
            // Important: also set instructor to a numeric value for consistency
            instructor: instructorId
          };
        });
        
        // Log the first session to verify
        if (this.sessions.length > 0) {
          console.log('First session processed:', {
            id: this.sessions[0].idSession,
            instructor: this.sessions[0].instructor,
            instructorId: this.sessions[0].instructorId
          });
        }
        
        this.filteredSessions = [...this.sessions];
        this.extractFilters();
        this.paginate();
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load sessions:', error);
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
  // Get all subject values (handle null/undefined too)
  const allSubjects = this.sessions
    .map(session => session.sessionSubject)
    .filter(subject => subject !== null && subject !== undefined) as string[];
  
  // Use Set to get unique values, then sort them alphabetically
  this.availableSubjects = Array.from(new Set(allSubjects)).sort();
  
  console.log('Extracted subjects:', this.availableSubjects);
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
    this.formSubmitted = false;

    if (!this.selectedSession) return;
  
    // Check if form is valid
    const form = document.querySelector('form');
    if (form && form.checkValidity() === false) {
      this.showToast('Please fill in all required fields', 'warning');
      return;
    }
    
    
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
    this.formSubmitted = true; // Set this flag to true to trigger validation messages
    
    // Get reference to the form and check validity
    const form = document.querySelector('form');
    if (form && form.checkValidity() === false) {
      this.showToast('Please fill in all required fields', 'warning');
      return; // Stop execution if form is invalid
    }
    
    this.loading = true;
    this.error = null;
    
    // Save the original instructor ID
    const originalInstructorId = Number(this.newSession.instructor);
    
    // Prepare the session data to send
    const sessionToAdd = {
      titleSession: this.newSession.titleSession.trim(),
      sessionDuration: Number(this.newSession.sessionDuration) || 30,
      startTime: this.startTimeString ? new Date(this.startTimeString).toISOString() : new Date().toISOString(),
      sessionSubject: this.newSession.sessionSubject?.trim(),
      instructor: {
        idInstructor: originalInstructorId
      }
    };
    
    console.log('Adding session with data:', JSON.stringify(sessionToAdd, null, 2));
    
    // Rest of your fetch code remains the same
    fetch('http://localhost:8088/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(sessionToAdd)
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
      
      // Process the response for instructor ID
      let instructorId = null;
      
      if (data.instructor) {
        if (typeof data.instructor === 'object') {
          instructorId = data.instructor.id || 
                        data.instructor.idInstructor || 
                        data.instructor.instructorId;
        } else if (typeof data.instructor === 'number') {
          instructorId = data.instructor;
        }
      }
      
      // Fallback to original ID if none extracted
      if (instructorId === null) {
        instructorId = originalInstructorId;
      }
      
      // Create processed session object
      const processedSession = {
        ...data,
        instructorId: instructorId,
        instructor: instructorId
      };
      
      // Update the UI
      this.sessions.push(processedSession);
      this.filteredSessions = [...this.sessions];
      this.paginate();
      this.resetForm();
      this.loading = false;
      this.showToast('Session added successfully!', 'success');
      this.triggerConfetti(); // Add this line

    })
    .catch(error => {
      console.error('Add failed:', error);
      this.error = `Add failed: ${error.message}`;
      this.loading = false;
      this.showToast(`Failed to add session: ${error.message}`, 'error');
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
    this.formSubmitted = true; // Set flag to show validation messages
    
    if (!this.selectedSession) return;
    
    // Get reference to the form and check validity
    const form = document.querySelector('form');
    if (form && form.checkValidity() === false) {
      this.showToast('Please fill in all required fields', 'warning');
      return; // Stop execution if form is invalid
    }
    
    this.loading = true;
    this.error = null;
    
    // Save original instructor ID
    const originalInstructorId = Number(this.selectedSession.instructor);
    
    // Prepare session data to update
    const sessionToUpdate = {
      ...this.selectedSession,
      // Normalize data
      titleSession: this.selectedSession.titleSession?.trim(),
      sessionSubject: this.selectedSession.sessionSubject?.trim(),
      sessionDuration: Number(this.selectedSession.sessionDuration),
      startTime: this.parseInputDate(this.selectedStartTimeString).toISOString(),
      instructor: {
        idInstructor: originalInstructorId
      }
    };
    
    console.log('Updating session with data:', JSON.stringify(sessionToUpdate, null, 2));
    
    // REST of your fetch code remains the same
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
      
      // Process the response for instructor ID
      let instructorId = null;
      
      if (data.instructor) {
        if (typeof data.instructor === 'object') {
          instructorId = data.instructor.id || 
                        data.instructor.idInstructor || 
                        data.instructor.instructorId;
        } else if (typeof data.instructor === 'number') {
          instructorId = data.instructor;
        }
      }
      
      // Fallback to original ID if none extracted
      if (instructorId === null) {
        instructorId = originalInstructorId;
      }
      
      // Create updated session object
      const updatedSession = {
        ...data,
        instructorId: instructorId,
        instructor: instructorId
      };
      
      // Update the UI
      const index = this.sessions.findIndex(s => s.idSession === data.idSession);
      if (index !== -1) {
        this.sessions[index] = updatedSession;
        this.sessions = [...this.sessions];
        this.filteredSessions = this.applyFilters([...this.sessions]);
        this.paginate();
      } else {
        this.fetchSessions();
      }
      
      this.selectedSession = null;
      this.showSessionList = true;
      this.loading = false;
      this.showToast('Session updated successfully!', 'success');
      this.triggerConfetti(); // Add this line

    })
    .catch(error => {
      console.error('Update failed:', error);
      this.error = `Update failed: ${error.message}`;
      this.loading = false;
      this.showToast(`Failed to update session: ${error.message}`, 'error');
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
    
    this.sessionService.deleteSession(idSession).subscribe({
      next: () => {
        console.log('Session deleted successfully');
        this.sessions = this.sessions.filter(s => s.idSession !== idSession);
        this.filteredSessions = [...this.sessions];
        this.loading = false;
        this.showToast('Session deleted successfully!', 'success');
      },
      error: (error) => {
        console.error('Error deleting session:', error);
        this.error = 'Failed to delete session. Please try again.';
        this.loading = false;
        this.showToast(`Failed to delete session: ${error.message}`, 'error');
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
// Also update error handling:
.catch(error => {
  console.error('Add failed:', error);
  this.error = `Add failed: ${error.message}`;
  this.loading = false;
  this.showToast(`Failed to add session: ${error.message}`, 'error');
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

debugFetchSessions() {
  console.log('Debug fetch sessions called');
  this.loading = true;
  this.error = null;
  
  // Use vanilla fetch to bypass Angular's HTTP client
  fetch('http://localhost:8088/api/sessions/all')
    .then(response => response.text())
    .then(text => {
      console.log('Raw text sample:', text.substring(0, 200));
      
      // Very aggressive cleaning approach - this will handle almost any malformed JSON
      let cleanedJson = text
        // Remove all circular references
        .replace(/,"session":\{[^}]*\}/g, ',"session":null')
        .replace(/,"feedbacks":\[[^\]]*\]/g, ',"feedbacks":[]')
        .replace(/,"instructor":\{[^}]*\}/g, ',"instructor":null')
        .replace(/,"session":}/g, '}');
        
      try {
        const data = JSON.parse(cleanedJson);
        console.log('Data parsed successfully:', data.length, 'items');
        this.sessions = data;
        this.filteredSessions = [...this.sessions];
        this.paginate();
      } catch (e) {
        console.error('Failed to parse even with cleaning:', e);
        // Last resort - extract just the minimal data we need
        this.debugSessionsWithRawData();
      }
      
      this.loading = false;
    })
    .catch(error => {
      this.error = `Failed to fetch: ${error.message}`;
      this.loading = false; 
    });
}

debugSessionsWithRawData() {
  this.loading = true;
  this.error = null;
  
  fetch('http://localhost:8088/api/sessions/all')
    .then(response => response.text())
    .then(text => {
      console.log('Raw API response length:', text.length);
      console.log('Sample first 200 chars:', text.substring(0, 200));
      
      // Use a more flexible method to extract session data
      // We'll use a map to deduplicate by ID
      const sessionMap = new Map();
      
      // First attempt: Try as valid JSON
      try {
        const jsonData = JSON.parse(text);
        if (Array.isArray(jsonData)) {
          jsonData.forEach(session => {
            if (session.idSession) {
              sessionMap.set(session.idSession, session);
            }
          });
          
          console.log('Successfully parsed as valid JSON, found', sessionMap.size, 'sessions');
        }
      } catch (e) {
        console.log('Not valid JSON, using regex extraction');
        
        // Second attempt: More flexible regex that doesn't care about field order
        const idRegex = /\"idSession\":(\d+)/g;
        const titleRegex = /\"titleSession\":\"([^\"]*)\"/g;
        const subjectRegex = /\"sessionSubject\":\"([^\"]*)\"/g;
        const startTimeRegex = /\"startTime\":\"([^\"]*)\"/g;
        const durationRegex = /\"sessionDuration\":(\d+)/g;
        
        // Extract all IDs first
        let idMatch;
        const ids = [];
        while ((idMatch = idRegex.exec(text)) !== null) {
          ids.push(parseInt(idMatch[1]));
        }
        console.log('Found', ids.length, 'potential session IDs');
        
        // Now process each ID
        ids.forEach(id => {
          if (sessionMap.has(id)) return; // Skip duplicates
          
          // Find fields for this specific session
          // We'll use substring to focus our search around each session
          const sessionIndex = text.indexOf(`"idSession":${id}`);
          if (sessionIndex === -1) return;
          
          // Extract 500 chars around this session as a smaller context
          const startIdx = Math.max(0, sessionIndex - 100);
          const endIdx = Math.min(text.length, sessionIndex + 400);
          const sessionContext = text.substring(startIdx, endIdx);
          
          // Extract fields from this context
          let title = '', subject = '', startTime = '', duration = 0;
          
          const titleMatch = /"titleSession":"([^"]*)"/g.exec(sessionContext);
          if (titleMatch) title = titleMatch[1];
          
          const subjectMatch = /"sessionSubject":"([^"]*)"/g.exec(sessionContext);
          if (subjectMatch) subject = subjectMatch[1];
          
          const startTimeMatch = /"startTime":"([^"]*)"/g.exec(sessionContext);
          if (startTimeMatch) startTime = startTimeMatch[1];
          
          const durationMatch = /"sessionDuration":(\d+)/g.exec(sessionContext);
          if (durationMatch) duration = parseInt(durationMatch[1]);
          
          // Create session object and add to map
          sessionMap.set(id, {
            idSession: id,
            titleSession: title,
            sessionSubject: subject,
            startTime: startTime,
            sessionDuration: duration,
            instructor: null
          });
        });
      }
      
      // Convert map to array
      const extractedData = Array.from(sessionMap.values());
      console.log('Final extracted data size:', extractedData.length);
      
      if (extractedData.length > 0) {
        // Sort by ID for consistency
        extractedData.sort((a, b) => a.idSession - b.idSession);
        
        this.sessions = extractedData;
        this.filteredSessions = [...this.sessions];
        this.paginate();
        this.loading = false;
        this.error = null;
        
        // Log what we found
        console.log('Extracted sessions:', extractedData);
      } else {
        this.error = "Failed to parse sessions data. Try restarting the backend.";
        this.loading = false;
      }
    })
    .catch(error => {
      this.error = `API error: ${error.message}`;
      this.loading = false;
    });
}

// Add this to session.component.ts
inspectSession(session: Session): void {
  console.log('Session inspector:', {
    id: session.idSession,
    title: session.titleSession,
    instructor: session.instructor,
    instructorType: typeof session.instructor
  });
  
  // If instructor is an object, log its properties
  if (session.instructor && typeof session.instructor === 'object') {
    console.log('Instructor properties:', Object.keys(session.instructor));
  }
}


// Add these methods to your class
showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  console.log('Showing toast:', message, type); // Add this line to confirm the method is called
  
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
  this.toasts.splice(index, 1);
}

formSubmitted = false;



// Add this method to your component
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




}