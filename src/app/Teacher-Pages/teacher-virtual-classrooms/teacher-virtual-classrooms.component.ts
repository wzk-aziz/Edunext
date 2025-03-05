import { Component, OnInit } from '@angular/core';
import { TeacherClassroomService, TeacherClassroomSession } from '../Teacher-Services/teacher-classroom.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-teacher-virtual-classrooms',
  templateUrl: './teacher-virtual-classrooms.component.html',
  styleUrls: ['./teacher-virtual-classrooms.component.css']
})
export class TeacherVirtualClassroomsComponent implements OnInit {
  sessions: TeacherClassroomSession[] = [];
  filteredSessions: TeacherClassroomSession[] = [];
  loading = true;
  error: string | null = null;
  
  // View mode
  viewMode: 'grid' | 'list' | 'calendar' = 'grid';
  
  // Filter properties
  searchTerm = '';
  statusFilter: 'all' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled' = 'all';
  subjectFilter = 'all';
  dateRangeStart: string = '';
  dateRangeEnd: string = '';
  durationFilter: 'all' | 'short' | 'medium' | 'long' = 'all';
  sortOrder: 'dateDesc' | 'dateAsc' | 'titleAsc' | 'titleDesc' | 'studentsDesc' = 'dateDesc';
  showAdvancedFilters = false;
  
  // Stats tracking
  previousActiveCount = 0;

  // Create session 
  sessionForm: FormGroup;
  today: string;
  modalInstance: any;
  
    
  constructor(
    private classroomService: TeacherClassroomService,
    private fb: FormBuilder // Add FormBuilder
  ) {
    // Initialize the form
    this.today = new Date().toISOString().slice(0, 10);
    this.sessionForm = this.fb.group({
      titleSession: ['', [Validators.required]],
      sessionSubject: ['', [Validators.required]],
      startDate: [this.today, [Validators.required]],
      startTime: ['10:00', [Validators.required]],
      sessionDuration: [60, [Validators.required, Validators.min(15), Validators.max(360)]],
      description: [''],
      instructor_id: [1], // Set instructor ID to 1
      zoomLink: ['', Validators.pattern('https?://.+')]
    });
  }

  ngOnInit(): void {
    this.loadTeacherSessions();
    
    // Set date range defaults to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    this.dateRangeStart = firstDay.toISOString().slice(0, 10);
    this.dateRangeEnd = lastDay.toISOString().slice(0, 10);
  }
  
  loadTeacherSessions(): void {
    this.loading = true;
    this.classroomService.getTeacherClassroomSessions().subscribe({
      next: (data) => {
        console.log('Received sessions:', data);
        this.sessions = data;
        
        // Store current active count for comparison
        this.previousActiveCount = this.getSessionCountByStatus('ongoing');
        
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sessions:', err);
        this.error = `Failed to load sessions: ${err.message}`;
        this.loading = false;
      }
    });
  }
  
  applyFilters(): void {
    // Start with all sessions
    let filtered = [...this.sessions];
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === this.statusFilter);
    }
    
    // Apply subject filter
    if (this.subjectFilter !== 'all') {
      filtered = filtered.filter(session => session.sessionSubject === this.subjectFilter);
    }
    
    // Apply date range filter
    if (this.dateRangeStart) {
      const startDate = new Date(this.dateRangeStart);
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= startDate;
      });
    }
    
    if (this.dateRangeEnd) {
      const endDate = new Date(this.dateRangeEnd);
      endDate.setHours(23, 59, 59); // End of day
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate <= endDate;
      });
    }
    
    // Apply duration filter
    if (this.durationFilter !== 'all') {
      filtered = filtered.filter(session => {
        const duration = session.sessionDuration || 0;
        switch (this.durationFilter) {
          case 'short': return duration < 60;
          case 'medium': return duration >= 60 && duration <= 120;
          case 'long': return duration > 120;
          default: return true;
        }
      });
    }
    
    // Apply search term filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(session => this.matchesSearch(session));
    }
    
    // Apply sorting
    filtered = this.sortSessions(filtered);
    
    this.filteredSessions = filtered;
  }
  
  sortSessions(sessions: TeacherClassroomSession[]): TeacherClassroomSession[] {
    return [...sessions].sort((a, b) => {
      switch (this.sortOrder) {
        case 'dateAsc':
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        case 'dateDesc':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case 'titleAsc':
          return (a.titleSession || '').localeCompare(b.titleSession || '');
        case 'titleDesc':
          return (b.titleSession || '').localeCompare(a.titleSession || '');
        case 'studentsDesc':
          return (b.enrolledStudents || 0) - (a.enrolledStudents || 0);
        default:
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      }
    });
  }
  
  matchesSearch(session: TeacherClassroomSession): boolean {
    const term = this.searchTerm.toLowerCase();
    
    // Use optional chaining and nullish coalescing to handle possible undefined values
    const title = session.titleSession?.toLowerCase() ?? '';
    const subject = session.sessionSubject?.toLowerCase() ?? '';
    const desc = session.description?.toLowerCase() ?? '';
    
    return title.includes(term) || subject.includes(term) || desc.includes(term);
  }
  
  onSearchChange(): void {
    this.applyFilters();
  }
  
  resetFilters(): void {
    this.statusFilter = 'all';
    this.subjectFilter = 'all';
    this.searchTerm = '';
    this.durationFilter = 'all';
    this.sortOrder = 'dateDesc';
    
    // Reset date range to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    this.dateRangeStart = firstDay.toISOString().slice(0, 10);
    this.dateRangeEnd = lastDay.toISOString().slice(0, 10);
    
    this.applyFilters();
  }
  
  applyQuickFilter(filter: string): void {
    const now = new Date();
    
    switch (filter) {
      case 'today':
        this.dateRangeStart = now.toISOString().slice(0, 10);
        this.dateRangeEnd = now.toISOString().slice(0, 10);
        this.statusFilter = 'all';
        break;
        
      case 'thisWeek':
        // Set to Monday of current week
        const monday = new Date(now);
        monday.setDate(now.getDate() - now.getDay() + 1);
        
        // Set to Sunday of current week
        const sunday = new Date(now);
        sunday.setDate(now.getDate() - now.getDay() + 7);
        
        this.dateRangeStart = monday.toISOString().slice(0, 10);
        this.dateRangeEnd = sunday.toISOString().slice(0, 10);
        this.statusFilter = 'all';
        break;
        
      case 'upcoming':
        this.dateRangeStart = now.toISOString().slice(0, 10);
        this.dateRangeEnd = '';
        this.statusFilter = 'scheduled';
        break;
        
      case 'popular':
        this.sortOrder = 'studentsDesc';
        this.dateRangeStart = '';
        this.dateRangeEnd = '';
        this.statusFilter = 'all';
        break;
    }
    
    this.applyFilters();
  }
  
  getUniqueSubjects(): string[] {
    const subjects = new Set<string>();
    
    this.sessions.forEach(session => {
      if (session.sessionSubject) {
        subjects.add(session.sessionSubject);
      }
    });
    
    return Array.from(subjects).sort();
  }
  
  // Stats methods
  getSessionCountByStatus(status: string): number {
    return this.sessions.filter(session => session.status === status).length;
  }
  
  calculateActiveSessionChange(): number {
    // For demo purposes, return a random positive increase
    // In a real app, you'd compare with previous period data
    return Math.floor(Math.random() * 20) + 5;
  }
  
  getAverageStudentsPerSession(): number {
    if (this.sessions.length === 0) return 0;
    return Math.round(this.getTotalStudents() / this.sessions.length);
  }
  
  getNextSessionDateString(): string {
    const now = new Date();
    
    // Find the next scheduled session
    const upcomingSessions = this.sessions
      .filter(session => session.status === 'scheduled' && new Date(session.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    if (upcomingSessions.length === 0) {
      return 'None scheduled';
    }
    
    const nextSession = upcomingSessions[0];
    const sessionDate = new Date(nextSession.startTime);
    
    // If it's today
    if (sessionDate.toDateString() === now.toDateString()) {
      return 'Today, ' + this.formatTime(nextSession.startTime);
    }
    
    // If it's tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    if (sessionDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    // Otherwise show the date
    return this.formatDate(nextSession.startTime);
  }
  
  getTotalTeachingHours(): number {
    // Calculate total hours from completed sessions
    const totalMinutes = this.sessions
      .filter(session => session.status === 'completed')
      .reduce((total, session) => total + (session.sessionDuration || 0), 0);
      
    return Math.round(totalMinutes / 60);
  }
  
  isSessionToday(session: TeacherClassroomSession): boolean {
    const sessionDate = new Date(session.startTime);
    const today = new Date();
    
    return sessionDate.toDateString() === today.toDateString();
  }
  
  getCapacityPercentage(session: TeacherClassroomSession): number {
    // Assuming a max capacity of 30 students per session
    const maxCapacity = 30;
    return Math.min(((session.enrolledStudents || 0) / maxCapacity) * 100, 100);
  }
  
  getStatusIcon(status: string): string {
    switch(status) {
      case 'scheduled': return 'fa-calendar-check me-1';
      case 'ongoing': return 'fa-play-circle me-1';
      case 'completed': return 'fa-check-circle me-1';
      case 'cancelled': return 'fa-times-circle me-1';
      default: return 'fa-circle me-1';
    }
  }
  
  // Format methods
  formatDate(date: Date): string {
    if (!date) return 'Date not available';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  formatTime(time: Date | string): string {
    if (!time) return 'Time not available';
    
    if (time instanceof Date) {
      return time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    }
    
    // If it's a string, return it as is
    return time;
  }
  
  // Calculate total enrolled students across all sessions
  getTotalStudents(): number {
    return this.sessions.reduce((total, session) => total + (session.enrolledStudents || 0), 0);
  }
  
  // Generate a consistent color based on subject
  getSubjectColor(subject: string | undefined): string {
    // Handle undefined subject
    if (!subject) {
      return '#607D8B'; // Default color for undefined subjects
    }
    
    const subjects = {
      'Mathematics': '#2E7D32', // Deeper green
      'Science': '#1565C0', // Deeper blue
      'History': '#FF8F00', // Deeper amber
      'English': '#6A1B9A', // Deeper purple
      'Computer Science': '#283593', // Deeper indigo
      'Programming': '#C2185B', // Deeper pink
      'Art': '#00695C', // Deeper teal
      'General': '#455A64' // Deeper blue-grey
    };
    
    // Return color if subject exists, or generate one
    if (subject in subjects) {
      return subjects[subject as keyof typeof subjects];
    }
    
    // Generate a color based on string hash with better saturation
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate more vibrant colors
    const h = hash % 360;
    return `hsl(${h}, 70%, 45%)`;
  }
  
  // Get status-dependent classes
  getStatusClass(status: string): string {
    switch(status) {
      case 'scheduled': return 'bg-info';
      case 'ongoing': return 'bg-success';
      case 'completed': return 'bg-secondary';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-light';
    }
  }

  getDurationDisplay(session: TeacherClassroomSession): string {
    if (!session.sessionDuration) return '';
    
    const hours = Math.floor(session.sessionDuration / 60);
    const minutes = session.sessionDuration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`;
    }
    
    return `${minutes}m`;
  }

  // Add this helper method to your component
  getSubjectDisplay(subject: string | undefined): string {
    return subject || 'No Subject';
  }

    // Add to TeacherVirtualClassroomsComponent class
  clearDateFilter(): void {
    this.dateRangeStart = '';
    this.dateRangeEnd = '';
    this.applyFilters();
  }

  createSession() {
    if (this.sessionForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.sessionForm.controls).forEach(field => {
        const control = this.sessionForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    
    // Get form values
    const formValues = this.sessionForm.value;
    
    // Create date object by combining date and time
    const startDate = new Date(formValues.startDate);
    const [hours, minutes] = formValues.startTime.split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes));
    
    // Create new session object
    const newSession: Partial<TeacherClassroomSession> = {
      titleSession: formValues.titleSession,
      sessionSubject: formValues.sessionSubject,
      startTime: startDate,
      sessionDuration: formValues.sessionDuration,
      instructor_id: 1, // Set instructor ID to 1
     // instructorId: 1,  // Add BOTH formats to ensure compatibility
      description: formValues.description || `${formValues.titleSession} session`, // Default description
      zoomLink: formValues.zoomLink || ''
      // Don't set status here, let backend assign default
    };
    
    console.log('Creating new session with instructor:', newSession);
    
    // Call the service to save to database
    this.classroomService.createSession(newSession).subscribe({
      // Rest of the code remains the same
      next: (savedSession) => {
        console.log('Session saved successfully:', savedSession);
        
        // Add the session returned from the server (with proper ID)
        this.sessions = [savedSession, ...this.sessions];
        
        // Reapply filters
        this.applyFilters();
        
        // Reset form and close modal
        this.sessionForm.reset({
          startDate: this.today,
          startTime: '10:00',
          sessionDuration: 60,
          // Keep default values when resetting
          titleSession: '',
          sessionSubject: '',
          description: '',
          zoomLink: ''
        });
        
        // Close the modal
        this.closeModal();
        
        // Show success message
        alert('Session created successfully!');
      },
      error: (error) => {
        console.error('Failed to save session:', error);
        alert('Failed to create session: ' + (error.message || 'Unknown error'));
      }
    });
  }

  closeModal() {
    // Find the modal element
    const modalElement = document.getElementById('createSessionModal');
    if (modalElement) {
      // Use Bootstrap's modal method to hide
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }




}