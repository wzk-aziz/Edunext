import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentVirtualClassroomService } from 'src/app/Student-Pages/Student-Services/student-vritual-classroom-services.service';
import { ClassroomSession } from './student-virtual-classroom-session.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-student-virtual-classroom-sessions',
  templateUrl: './student-virtual-classroom-sessions.component.html',
  styleUrls: ['./student-virtual-classroom-sessions.component.css']
})
export class StudentVirtualClassroomSessionsComponent implements OnInit {
  sessions: ClassroomSession[] = [];
  filteredSessions: ClassroomSession[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  // For filtering
  searchText: string = '';
  statusFilter: 'all' | 'live' | 'upcoming' | 'completed' = 'all';
  datePreset: 'all' | 'today' | 'tomorrow' | 'week' | 'custom' = 'all';
  dateRange = {
    start: '',
    end: ''
  };
  instructorFilter: string | number = 'all';
  durationFilter: 'all' | 'short' | 'medium' | 'long' = 'all';
  availableInstructors: {id: number, name: string}[] = [];

  // Reminder
showReminderModal = false;
currentSession: ClassroomSession | null = null;
reminderEmail: string = '';
reminderSuccess = false;
emailError: string | null = null;
  
  constructor(
    private studentVirtualClassroomService: StudentVirtualClassroomService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading = true;
    this.error = null;
    
    this.studentVirtualClassroomService.getAvailableSessions().subscribe({
      next: (data: ClassroomSession[]) => {
        console.log("API data received:", data);
        this.sessions = data;
        this.filteredSessions = [...data];
        this.loading = false;
        
        // Extract available instructors for the filter
        this.extractInstructors();
        
        if (data.length === 0) {
          this.error = "No sessions available in the database.";
        }
      },
      error: (err: Error) => {
        console.error('Error loading sessions from API:', err);
        this.error = `API Error: ${err.message}`;
        this.loading = false;
      }
    });
  }

  joinSession(sessionId: number): void {
    console.log(`Joining session ${sessionId}`);
    this.router.navigate(['/student-virtual-classroom', sessionId]);
  }
  
  // Extract unique instructors from sessions for the filter dropdown
  extractInstructors(): void {
    const uniqueInstructors = new Map<number, string>();
    
    this.sessions.forEach(session => {
      if (session.instructorId) {
        uniqueInstructors.set(session.instructorId, session.instructorName);
      }
    });
    
    this.availableInstructors = Array.from(uniqueInstructors.entries()).map(([id, name]) => ({ 
      id, 
      name 
    }));
  }

  // Apply all filters at once
  applyFilters(): void {
    // Start with all sessions
    let filtered = [...this.sessions];
    
    // Apply text search filter
    if (this.searchText.trim()) {
      const searchTerm = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(session => 
        (session.titleSession?.toLowerCase().includes(searchTerm) || false) || 
        (session.instructorName?.toLowerCase().includes(searchTerm) || false) ||
        (session.description?.toLowerCase().includes(searchTerm) || false)
      );
    }
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === this.statusFilter);
    }
    
    // Apply date filter
    if (this.datePreset !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.startTime as string);
        
        switch(this.datePreset) {
          case 'today':
            return sessionDate >= today && sessionDate < tomorrow;
            
          case 'tomorrow':
            const dayAfterTomorrow = new Date(tomorrow);
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
            return sessionDate >= tomorrow && sessionDate < dayAfterTomorrow;
            
          case 'week':
            return sessionDate >= today && sessionDate < nextWeek;
            
          case 'custom':
            const startDate = this.dateRange.start ? new Date(this.dateRange.start) : null;
            const endDate = this.dateRange.end ? new Date(this.dateRange.end) : null;
            
            if (startDate && endDate) {
              // Add one day to end date to include the full day
              const endDatePlusOne = new Date(endDate);
              endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
              return sessionDate >= startDate && sessionDate < endDatePlusOne;
            } else if (startDate) {
              return sessionDate >= startDate;
            } else if (endDate) {
              const endDatePlusOne = new Date(endDate);
              endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
              return sessionDate < endDatePlusOne;
            }
            return true;
        }
        
        return true;
      });
    }
    
    // Apply instructor filter
    if (this.instructorFilter !== 'all') {
      const instructorId = Number(this.instructorFilter);
      filtered = filtered.filter(session => session.instructorId === instructorId);
    }
    
    // Apply duration filter
    if (this.durationFilter !== 'all') {
      filtered = filtered.filter(session => {
        const duration = session.sessionDuration;
        
        switch(this.durationFilter) {
          case 'short':
            return duration < 30;
          case 'medium':
            return duration >= 30 && duration <= 60;
          case 'long':
            return duration > 60;
          default:
            return true;
        }
      });
    }
    
    this.filteredSessions = filtered;
  }

  // Original search filter (updated to call applyFilters)
  filterSessions(): void {
    this.applyFilters();
  }

  setStatusFilter(status: 'all' | 'live' | 'upcoming' | 'completed'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  setDatePreset(preset: 'all' | 'today' | 'tomorrow' | 'week' | 'custom'): void {
    this.datePreset = preset;
    
    // Initialize date range if selecting custom
    if (preset === 'custom' && !this.dateRange.start) {
      const today = new Date();
      this.dateRange.start = today.toISOString().split('T')[0];
      
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      this.dateRange.end = nextWeek.toISOString().split('T')[0];
    }
    
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchText = '';
    this.statusFilter = 'all';
    this.datePreset = 'all';
    this.dateRange = { start: '', end: '' };
    this.instructorFilter = 'all';
    this.durationFilter = 'all';
    this.filteredSessions = [...this.sessions];
  }

  hasActiveFilters(): boolean {
    return this.searchText.trim() !== '' ||
           this.statusFilter !== 'all' ||
           this.datePreset !== 'all' ||
           this.instructorFilter !== 'all' ||
           this.durationFilter !== 'all';
  }

  getDateFilterDisplayText(): string {
    switch(this.datePreset) {
      case 'today': return 'Today';
      case 'tomorrow': return 'Tomorrow';
      case 'week': return 'This Week';
      case 'custom': 
        const start = this.dateRange.start ? new Date(this.dateRange.start).toLocaleDateString() : '';
        const end = this.dateRange.end ? new Date(this.dateRange.end).toLocaleDateString() : '';
        return `${start} to ${end}`;
      default: return '';
    }
  }

  getDurationDisplayText(): string {
    switch(this.durationFilter) {
      case 'short': return 'Short (< 30 min)';
      case 'medium': return 'Medium (30-60 min)';
      case 'long': return 'Long (> 60 min)';
      default: return '';
    }
  }

  getInstructorName(id: string | number): string {
    if (id === 'all') return '';
    const instructor = this.availableInstructors.find(i => i.id === Number(id));
    return instructor ? instructor.name : '';
  }
  
  // Debug methods
  showApiResponse(): void {
    this.http.get('http://localhost:8088/api/sessions/all').subscribe({
      next: (response) => {
        console.log('Raw API response:', response);
        alert('API response logged to console - please check browser console (F12)');
      },
      error: (err) => {
        console.error('Error fetching API:', err);
        alert(`API Error: ${err.message}`);
      }
    });
  }

  turnOffMockData(): void {
    this.loadSessions();
  }

  testAllMethods(): void {
    const url = 'http://localhost:8088/api/sessions/all';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    console.log("Testing GET method...");
    this.http.get(url, { headers }).subscribe({
      next: res => console.log("✅ GET success:", res),
      error: err => console.error("❌ GET error:", err.status, err.statusText)
    });
    
    console.log("Testing POST method...");
    this.http.post(url, {}, { headers }).subscribe({
      next: res => console.log("✅ POST success:", res),
      error: err => console.error("❌ POST error:", err.status, err.statusText)
    });
  }

  // Add this method to handle the button click
  showReminderDialog(session: ClassroomSession): void {
    if (session.status === 'upcoming') {
      this.currentSession = session;
      this.showReminderModal = true;
      this.reminderEmail = '';
      this.reminderSuccess = false;
      this.emailError = null;
    } else {
      this.joinSession(session.idSession!);
    }
  }
  
  // Add method to validate email
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  
  // Add method to submit reminder
  submitReminder(): void {
    if (!this.reminderEmail) {
      this.emailError = "Please enter your email address";
      return;
    }
    
    if (!this.validateEmail(this.reminderEmail)) {
      this.emailError = "Please enter a valid email address";
      return;
    }
    
    // In a real app, you'd send this to your backend
    console.log(`Reminder set for session ${this.currentSession?.idSession} to email ${this.reminderEmail}`);
    
    // Save to localStorage for demo purposes
    const reminders = JSON.parse(localStorage.getItem('sessionReminders') || '[]');
    reminders.push({
      sessionId: this.currentSession?.idSession,
      email: this.reminderEmail,
      sessionTitle: this.currentSession?.titleSession,
      startTime: this.currentSession?.startTime,
      date: new Date().toISOString()
    });
    localStorage.setItem('sessionReminders', JSON.stringify(reminders));
    
    // Show success message
    this.reminderSuccess = true;
    
    // Close modal after delay
    setTimeout(() => {
      this.showReminderModal = false;
    }, 3000);
  }
  
  closeReminderModal(): void {
    this.showReminderModal = false;
  }
}