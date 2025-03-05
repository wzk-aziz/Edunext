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

  //Messages 
showToast = false;
toastMessage = '';
toastType = 'success';
toastIcon = '';
toastTitle = '';
  
    
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
    
    this.dateRangeStart = '';
    this.dateRangeEnd = '';
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


  // Replace your current createSession method with this:
  createSession() {
    this.isEditing = false;
    this.editingSession = null;
    this.saveSession();
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

    // Add these helper methods to your component class
  
  // For date filter display
  showCustomDateRange = false;
  
  isDatePresetActive(preset: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as start of week
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday as end of week
    
    if (preset === 'today') {
      const formattedToday = today.toISOString().split('T')[0];
      return this.dateRangeStart === formattedToday && this.dateRangeEnd === formattedToday;
    } else if (preset === 'thisWeek') {
      const formattedStartOfWeek = startOfWeek.toISOString().split('T')[0];
      const formattedEndOfWeek = endOfWeek.toISOString().split('T')[0];
      return this.dateRangeStart === formattedStartOfWeek && this.dateRangeEnd === formattedEndOfWeek;
    }
    return false;
  }
  
  getDateRangeDisplayText(): string {
    if (!this.dateRangeStart && !this.dateRangeEnd) return 'All Dates';
    if (this.dateRangeStart && !this.dateRangeEnd) return `From ${this.formatDateShort(this.dateRangeStart)}`;
    if (!this.dateRangeStart && this.dateRangeEnd) return `Until ${this.formatDateShort(this.dateRangeEnd)}`;
    if (this.dateRangeStart === this.dateRangeEnd) return this.formatDateShort(this.dateRangeStart);
    return `${this.formatDateShort(this.dateRangeStart)} - ${this.formatDateShort(this.dateRangeEnd)}`;
  }
  
  formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  getDurationDisplayText(): string {
    switch(this.durationFilter) {
      case 'short': return 'Short (< 60 min)';
      case 'medium': return 'Medium (60-120 min)';
      case 'long': return 'Long (> 120 min)';
      default: return 'Any Length';
    }
  }
  
  hasActiveFilters(): boolean {
    return this.statusFilter !== 'all' || 
           this.subjectFilter !== 'all' || 
           this.durationFilter !== 'all' ||
           this.searchTerm.trim() !== '' ||
           !!this.dateRangeStart ||
           !!this.dateRangeEnd;
  }
  
  // Add missing method
  clearDateFilter(): void {
    this.dateRangeStart = '';
    this.dateRangeEnd = '';
    this.showCustomDateRange = false;
  }

    // Add these properties to your component class
  editingSession: TeacherClassroomSession | null = null;
  isEditing: boolean = false;
  
  // Add these methods to your component class
  
  // Opens the edit modal with session data
  editSession(session: TeacherClassroomSession): void {
    this.isEditing = true;
    this.editingSession = { ...session };
    
    // Convert date to ISO string format for the date input
    const startDate = new Date(session.startTime);
    const formattedDate = startDate.toISOString().split('T')[0];
    
    // Format time for the time input (HH:MM)
    const hours = startDate.getHours().toString().padStart(2, '0');
    const minutes = startDate.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    
    // Set form values
    this.sessionForm.patchValue({
      titleSession: session.titleSession,
      sessionSubject: session.sessionSubject,
      startDate: formattedDate,
      startTime: formattedTime,
      sessionDuration: session.sessionDuration,
      description: session.description || '',
      zoomLink: session.zoomLink || '',
      instructor_id: session.instructor_id || 1
    });
    
    // Open modal
    const modalElement = document.getElementById('createSessionModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
  
  // Handle save for both create and update
  saveSession(): void {
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
    
    // Create session object
    const sessionData: Partial<TeacherClassroomSession> = {
      titleSession: formValues.titleSession,
      sessionSubject: formValues.sessionSubject,
      startTime: startDate,
      sessionDuration: formValues.sessionDuration,
      instructor_id: 1,
      description: formValues.description || `${formValues.titleSession} session`,
      zoomLink: formValues.zoomLink || ''
    };
    
    if (this.isEditing && this.editingSession) {
      // Update existing session
      sessionData.idSession = this.editingSession.idSession;
      sessionData.status = this.editingSession.status;
      
      this.classroomService.updateSession(sessionData).subscribe({
        next: (updatedSession) => {
          console.log('Session updated successfully:', updatedSession);
          
          // Find and replace the session in the array
          const index = this.sessions.findIndex(s => s.idSession === updatedSession.idSession);
          if (index !== -1) {
            this.sessions[index] = updatedSession;
          }
          
          // Reapply filters
          this.applyFilters();
          
          // Reset form and close modal
          this.resetForm();
          this.closeModal();
          
          // Show success message
          this.showNotification('success', 'Session updated successfully!');
        },
        error: (error) => {
          console.error('Failed to update session:', error);
          this.showNotification('success', 'Session updated successfully!');
        }
      });
    } else {
      // Create new session
      this.classroomService.createSession(sessionData).subscribe({
        next: (savedSession) => {
          console.log('Session created successfully:', savedSession);
          
          // Add the session returned from the server
          this.sessions = [savedSession, ...this.sessions];
          
          // Reapply filters
          this.applyFilters();
          
          // Reset form and close modal
          this.resetForm();
          this.closeModal();
          
          // Show success message
          this.showNotification('success', 'Session created successfully!');
        },
        error: (error) => {
          console.error('Failed to create session:', error);
this.showNotification('error', 'Failed to create session: ' + (error.message || 'Unknown error'));
        }
      });
    }
  }
  
  // Delete a session with confirmation
  deleteSession(session: TeacherClassroomSession): void {
    // Show confirmation dialog
    if (!confirm(`Are you sure you want to delete "${session.titleSession}"? This action cannot be undone.`)) {
      return;
    }
    
    this.classroomService.deleteSession(session.idSession).subscribe({
      next: () => {
        console.log('Session deleted successfully');
        
        // Remove from sessions array
        this.sessions = this.sessions.filter(s => s.idSession !== session.idSession);
        
        // Reapply filters
        this.applyFilters();
        
        // Show success message
this.showNotification('success', 'Session deleted successfully!');
      },
      error: (error) => {
        console.error('Failed to delete session:', error);
this.showNotification('error', 'Failed to delete session: ' + (error.message || 'Unknown error'));      }
    });
  }
  
  // Helper method to reset the form
  resetForm(): void {
    this.isEditing = false;
    this.editingSession = null;
    
    this.sessionForm.reset({
      startDate: this.today,
      startTime: '10:00',
      sessionDuration: 60,
      titleSession: '',
      sessionSubject: '',
      description: '',
      zoomLink: '',
      instructor_id: 1
    });
  }

  
  // Add this method to create fancy notifications
  showNotification(type: 'success' | 'error' | 'warning', message: string): void {
    const titles = {
      success: ['Awesome! 🌟', 'Success! 🎉', 'Great job! 👏', 'Excellent! 🔥', 'Fantastic! ✨'],
      error: ['Oops! 😬', 'Hmm, that didn\'t work 🤔', 'Houston, we have a problem! 🚀', 'Error! 🚨', 'That\'s not right 😕'],
      warning: ['Careful there! 🧐', 'Heads up! 👀', 'Just so you know... 💭', 'Attention needed! 🔔']
    };
    
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle'
    };
    
    // Success message variations
    const successMessages = {
      create: [
        "Your brilliant new session is ready to shine!",
        "Session created and ready for awesome learning moments!",
        "New session added to your teaching repertoire!",
        "You've just planted seeds of knowledge with this new session!"
      ],
      update: [
        "Session updated with your magical teaching touch!",
        "Changes saved! Your session looks even better now!",
        "Session refreshed and ready to inspire students!",
        "Excellent updates! Your session is looking fantastic!"
      ],
      delete: [
        "Session deleted faster than students leaving on Friday!",
        "Poof! That session is now in the digital recycling bin.",
        "Session removed. Time to create something even better!",
        "That session is history! Onward to new teaching adventures!"
      ]
    };
  
    // Set random title from the appropriate category
    this.toastTitle = titles[type][Math.floor(Math.random() * titles[type].length)];
    
    // If it's a standard message, use it directly
    if (!message.includes('successfully')) {
      this.toastMessage = message;
    } else {
      // Otherwise pick a creative alternative based on the action
      const action = message.includes('created') ? 'create' : 
                    message.includes('updated') ? 'update' : 
                    message.includes('deleted') ? 'delete' : '';
      
      if (action && successMessages[action]) {
        this.toastMessage = successMessages[action][Math.floor(Math.random() * successMessages[action].length)];
      } else {
        this.toastMessage = message;
      }
    }
    
    this.toastType = type;
    this.toastIcon = icons[type];
    this.showToast = true;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }



}