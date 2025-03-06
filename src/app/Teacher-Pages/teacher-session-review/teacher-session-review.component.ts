import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VideoConferenceService, Participant, ChatMessage } from '../Teacher-Services/video-conference.service';

interface Question {
  student: string;
  time: string;
  content: string;
  answered: boolean;
  answer?: string;
}

interface Feedback {
  id: number;
  studentId: number;
  rating: number;
  content: string;
  timestamp: string;
}

interface RatingDistribution {
  rating: number;
  count: number;
  percent: number;
}

interface Student {
  id: number;
  name: string;
  timeActive: number;
  engagementPercent: number;
  questionsAsked: number;
  handRaised?: boolean;
  isMuted?: boolean;  // Add this property
  isVideoOn?: boolean;  // Also add this for completeness
}

@Component({
  selector: 'app-teacher-session-review',
  templateUrl: './teacher-session-review.component.html',
  styleUrls: ['./teacher-session-review.component.css']
})
export class TeacherSessionReviewComponent implements OnInit, OnDestroy {
  // View child references
  @ViewChild('userVideo') userVideoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('screenVideo') screenVideoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('messagesContainer') messagesContainer?: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  
  // Status flags
  loading = true;
  error: string | null = null;
  
  // Session data
  session: any = null;
  currentSessionId: number | null = null;
  
  // Media states
  cameraEnabled = false;
  micEnabled = false;
  screenSharing = false;
  videoSource = '';
  videoAvailable = false;
  userStream: MediaStream | null = null;
  screenStream: MediaStream | null = null;
  
  // UI states
  showAnalytics = false;
  showParticipants = false;
  newMessage = '';
  
  // Analytics data
  attendanceRate = 0;
  averageEngagement = 0;
  highEngagementCount = 0;
  questionsCount = 0;
  answeredQuestionsCount = 0;
  averageRating = 0;
  feedbackCount = 0;
  ratingDistribution: RatingDistribution[] = [];
  
  // Student data
  searchStudentTerm = '';
  students: Student[] = [];
  get filteredStudents(): Student[] {
    if (!this.searchStudentTerm) return this.students;
    return this.students.filter(student => 
      student.name.toLowerCase().includes(this.searchStudentTerm.toLowerCase())
    );
  }
  
  // Chat data
  chatMessages: ChatMessage[] = [];
  studentQuestions: Question[] = [];
  
  // Modal states
  showFeedbackModalFlag = false;
  get isFeedbackModalVisible(): boolean {
    return this.showFeedbackModalFlag;
  }
  sessionFeedback: Feedback[] = [];
  
  // Follow-up modal
  showFollowupModal = false;
  followupSubject = '';
  followupMessage = '';

  // Add these properties to your component
showSessionTimePopup = false;  // Show popup by default when page loads
isSessionActive = false;
isSessionPast = false;
isSessionFuture = true;

// Add properties
showLeaveConfirmation = false;

  
  // Subscriptions to clean up
  private subscriptions: Subscription[] = [];

    // In teacher-session-review.component.ts - add this with your other properties
  currentTab: 'analytics' | 'recording' | 'chat' = 'analytics';

  //File input
  selectedFile: File | null = null;
maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoConferenceService
  ) {}

  
  // Then in ngOnInit, add this after loading session details:
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const sessionId = params.get('id');
      if (sessionId) {
        this.currentSessionId = parseInt(sessionId);
        this.loadSessionDetails(this.currentSessionId);
        
        // Automatically go to video interface after loading
        setTimeout(() => {
          if (!this.loading && !this.error) {
            this.reviewRecording();  // This will show the video interface
          }
        }, 1500); // Wait for loading to complete
      } else {
        this.error = 'Session ID not provided';
        this.loading = false;
      }
    });
  }
  
  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Stop all media streams
    this.stopMedia();
    
    // Leave the video session
    this.videoService.leaveSession().subscribe();
  }
  
  loadSessionDetails(sessionId: number | null): void {
    this.loading = true;
    this.error = null;

    if (sessionId === undefined || sessionId === null) {
      if (!this.currentSessionId) {
        this.error = 'Session ID not provided';
        this.loading = false;
        return;
      }
      sessionId = this.currentSessionId;
    }
  
    
    if (sessionId === undefined) {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.error = 'Session ID not provided';
        this.loading = false;
        return;
      }
      sessionId = parseInt(id);
    }
    
    // Join the video session as a teacher
    const joinSub = this.videoService.joinSession(sessionId, true)
      .subscribe({
        next: (success) => {
          if (success) {
            // Subscribe to session info
            const sessionSub = this.videoService.session$.subscribe(session => {
              this.session = session;
              this.checkSessionTiming();

              
              // Determine if video is available
              this.videoAvailable = this.session?.status === 'ongoing' || 
                (this.session?.status === 'completed' && Math.random() > 0.5);
            });
            
            // Subscribe to participants
            const participantsSub = this.videoService.participants$.subscribe(participants => {
              // Map participants to students for the UI
              this.students = participants
                .filter(p => !p.isTeacher)
                .map(p => ({
                  id: p.id,
                  name: p.name,
                  timeActive: Math.floor(Math.random() * 60),
                  engagementPercent: Math.floor(Math.random() * 100),
                  questionsAsked: Math.floor(Math.random() * 3),
                  handRaised: p.handRaised
                }));
            });
            
            // Subscribe to messages
            const messagesSub = this.videoService.messages$.subscribe(messages => {
              this.chatMessages = messages;
              
              // Scroll to bottom of chat when new messages arrive
              setTimeout(() => {
                this.scrollChatToBottom();
              }, 100);
            });
            
            // Add subscriptions for cleanup
            this.subscriptions.push(sessionSub, participantsSub, messagesSub);
            
            // Load mock messages for testing
            this.videoService.loadMockMessages();
            
            // Load additional demo data
            this.loadAnalyticsData();
            this.loadQuestions();
            this.loadFeedbackData();
            
            // Initialize media
            this.initializeMedia();
            
            this.loading = false;
          } else {
            this.error = 'Failed to join session';
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Failed to join session', err);
          this.error = 'Failed to join session. Please try again.';
          this.loading = false;
        }
      });
      
    this.subscriptions.push(joinSub);
  }
  
  // Media handling
  async initializeMedia(): Promise<void> {
    try {
      console.log('Initializing media...');
      
      // Get user media with more specific constraints
      this.userStream = await this.videoService.getUserStream();
      console.log('User stream obtained:', this.userStream);
      
      // Connect stream to video element with a delay to ensure DOM is ready
      setTimeout(() => {
        if (this.userVideoElement && this.userVideoElement.nativeElement) {
          console.log('Setting video source object');
          this.userVideoElement.nativeElement.srcObject = this.userStream;
          this.userVideoElement.nativeElement.play().catch(e => console.error('Error playing video:', e));
        } else {
          console.warn('Video element not found in DOM');
        }
      }, 300);
      
      // Enable camera and mic by default
      this.cameraEnabled = true;
      this.micEnabled = true;
      
      console.log('Media initialized successfully');
    } catch (err) {
      console.error('Error initializing media:', err);
      // Show error message but keep interface responsive
      this.cameraEnabled = false;
      this.micEnabled = false;
      alert('Could not access camera or microphone. Please check permissions and try again.');
    }
  }
  
  stopMedia(): void {
    this.videoService.stopUserStream();
    this.videoService.stopScreenStream();
    this.userStream = null;
    this.screenStream = null;
  }
  
  // UI control methods
  toggleCamera(): void {
    this.cameraEnabled = !this.cameraEnabled;
    this.videoService.toggleVideo(this.cameraEnabled);
  }
  
  toggleMic(): void {
    this.micEnabled = !this.micEnabled;
    this.videoService.toggleAudio(this.micEnabled);
  }
  
  async toggleScreenShare(): Promise<void> {
    if (this.screenSharing) {
      // Stop screen sharing
      this.videoService.stopScreenStream();
      this.screenSharing = false;
      this.screenStream = null;
      console.log('Screen sharing stopped');
    } else {
      try {
        // Start screen sharing
        console.log('Requesting screen stream...');
        this.screenStream = await this.videoService.getScreenStream();
        console.log('Screen stream obtained:', this.screenStream);
        
        // Set a timeout to ensure DOM is updated
        setTimeout(() => {
          if (this.screenVideoElement && this.screenVideoElement.nativeElement) {
            console.log('Setting screen video source');
            this.screenVideoElement.nativeElement.srcObject = this.screenStream;
            // Add error handling for video playback
            this.screenVideoElement.nativeElement.play()
              .catch(e => console.error('Error playing screen share video:', e));
          } else {
            console.warn('Screen video element not found in DOM');
          }
          
          this.screenSharing = true;
        }, 100);
      } catch (err) {
        console.error('Error sharing screen:', err);
        alert('Could not share screen. Please check permissions.');
      }
    }
  }
  
  toggleAnalyticsPane(): void {
    this.currentTab = 'analytics';
    this.showAnalytics = true;
    this.showParticipants = false;
  }
  
  toggleParticipantsPanel(): void {
    this.showParticipants = !this.showParticipants;
    if (this.showParticipants) {
      this.showAnalytics = false;
    }
  }
  
  // Chat methods
  sendMessage(): void {
    const hasMessage = this.newMessage.trim().length > 0;
    
    if (hasMessage) {
      this.videoService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
    
    if (this.selectedFile) {
      this.sendFileMessage();
    }
  }
  
// Replace your existing scrollChatToBottom method
scrollChatToBottom(): void {
  setTimeout(() => {
    if (this.messagesContainer && this.messagesContainer.nativeElement) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }, 50);
}
  
  // Question handling
  answerQuestion(question: Question): void {
    // In a real app, this would open a modal to answer the question
    question.answered = true;
    question.answer = 'This is a sample answer to the student question.';
    this.answeredQuestionsCount++;
    
    // Add a system message about the answer
    this.videoService.sendMessage(`[ANSWER] ${question.answer}`);
  }
  
  // Modal management
  showFeedbackModal(): void {
    this.showFeedbackModalFlag = true;
  }
  
  closeFeedbackModal(): void {
    this.showFeedbackModalFlag = false;
  }
  
  closeFollowupModal(): void {
    this.showFollowupModal = false;
  }
  
  // Action methods
  sendFollowUp(): void {
    this.followupSubject = `Follow-up for ${this.session?.titleSession}`;
    this.followupMessage = 'Thank you for attending the session. Here are the key points we covered...';
    this.showFollowupModal = true;
  }
  
  sendFollowupMessage(): void {
    console.log('Sending follow-up message:', {
      subject: this.followupSubject,
      message: this.followupMessage
    });
    // Implementation would connect to an email service
    this.showFollowupModal = false;
  }
  
  downloadReport(): void {
    console.log('Downloading report for session', this.session?.idSession);
    // Implementation would connect to a reporting service
  }
  
  downloadChatLog(): void {
    console.log('Downloading chat log for session', this.session?.idSession);
    
    // Simple implementation to download chat as text
    const chatText = this.chatMessages
      .map(msg => `[${msg.time}] ${msg.sender}: ${msg.content}`)
      .join('\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-log-session-${this.session?.idSession}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  
  uploadRecording(): void {
    // This would typically open a file picker dialog
    console.log('Upload recording clicked');
    alert('This would open a file upload dialog in a real implementation');
  }
  
  // Utility methods
  formatDate(date?: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  getDurationDisplay(): string {
    if (!this.session?.duration) return 'Duration unknown';
    return `${this.session.duration} minutes`;
  }
  
  getMomentIcon(type: string): string {
    switch (type) {
      case 'question': return 'fa-question-circle';
      case 'poll': return 'fa-poll';
      case 'highlight': return 'fa-star';
      case 'engagement': return 'fa-chart-line';
      default: return 'fa-info-circle';
    }
  }
  
  // Data loading methods for demo purposes
  private loadAnalyticsData(): void {
    // Mock analytics data
    this.attendanceRate = 85;
    this.averageEngagement = 72;
    this.highEngagementCount = 15;
    this.questionsCount = 12;
    this.answeredQuestionsCount = 10;
    this.averageRating = 4.2;
    this.feedbackCount = 18;
    
    // Generate rating distribution
    this.ratingDistribution = [
      { rating: 5, count: 10, percent: 55 },
      { rating: 4, count: 5, percent: 28 },
      { rating: 3, count: 2, percent: 11 },
      { rating: 2, count: 1, percent: 6 },
      { rating: 1, count: 0, percent: 0 }
    ];
  }
  
  private loadQuestions(): void {
    // Generate mock student questions
    this.studentQuestions = [
      {
        student: 'Student 5',
        time: '10:15',
        content: 'Could you explain dependency injection in more detail?',
        answered: true,
        answer: 'Dependency injection is a design pattern where a class receives its dependencies from external sources rather than creating them itself.'
      },
      {
        student: 'Student 12',
        time: '10:35',
        content: 'How do we handle asynchronous operations in Angular?',
        answered: false
      },
      {
        student: 'Student 3',
        time: '10:42',
        content: 'What\'s the difference between ngOnInit and constructor?',
        answered: false
      }
    ];
    
    this.questionsCount = this.studentQuestions.length;
    this.answeredQuestionsCount = this.studentQuestions.filter(q => q.answered).length;
  }
  
  private loadFeedbackData(): void {
    // Generate mock feedback
    this.sessionFeedback = [
      {
        id: 1,
        studentId: 5,
        rating: 5,
        content: 'Great session! The examples were very helpful.',
        timestamp: '2 days ago'
      },
      {
        id: 2,
        studentId: 12,
        rating: 4,
        content: 'Content was useful but would have liked more time for questions.',
        timestamp: '2 days ago'
      },
      {
        id: 3,
        studentId: 8,
        rating: 5,
        content: 'Very clear explanations of complex concepts.',
        timestamp: '1 day ago'
      }
    ];
    
    this.feedbackCount = this.sessionFeedback.length;
  }

  setActiveTab(tab: 'analytics' | 'recording' | 'chat'): void {
    this.currentTab = tab;
    
    // Update visibility flags based on selected tab
    this.showAnalytics = (tab === 'analytics');
    this.showParticipants = false;
    
    // Scroll chat to bottom when changing to chat tab
    if (tab === 'chat') {
      this.scrollChatToBottom();
    }
  }
  
  // Add this to ngOnInit or after session data is loaded
  checkSessionTiming(): void {
    if (!this.session?.startTime) {
      return;
    }
    
    const now = new Date();
    const sessionStart = new Date(this.session.startTime);
    const sessionEnd = new Date(sessionStart.getTime() + (this.session.duration * 60000)); // duration in minutes
    
    this.isSessionActive = now >= sessionStart && now <= sessionEnd;
    this.isSessionPast = now > sessionEnd;
    this.isSessionFuture = now < sessionStart;
  }
  
  // Replace existing closeSessionTimePopup method with this:
  closeSessionTimePopup(): void {
    this.showSessionTimePopup = false;
    
    // Navigate back to sessions list
    this.router.navigate(['/teacher/virtual-classrooms']);
  }


  joinLiveSession(): void {
    this.showSessionTimePopup = false;
    
    // Make sure video is available
    this.videoAvailable = true;
    
    // Initialize media with a delay to ensure UI is ready
    setTimeout(() => {
      this.initializeMedia();
      
      // Force layout update
      this.cameraEnabled = true;
      this.showAnalytics = false;
      this.showParticipants = false;
      
      // Add a placeholder video source while waiting for actual stream
      // This helps with layout rendering
      this.videoSource = 'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAxdtZGF0AAACrwYF//+13EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTE1IGxvb2thaGVhZF90aHJlYWRzPTIgc2xpY2VkX3RocmVhZHM9MCBzbHJfPTAgbmw9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MCBvcGVuX2dvcD0wIHdlaWdodHA9MiBrZXlpbnQ9MjUwIGtleWludF9taW49MjMgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0zMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IGlwX3JhdGlvPTEuNDAgYXE9MToxLjAwAIAAAAAwZYiEAD//8W+n0uQifBvQCPyM9G9uzOUm8dABvQL9ZOCbvMAv+ZXbtk+NcAAAAwAADZgAAQz5AZ0ABMOG8AEcTGF2YzU3LjY0LjEwMAAQAAGYAAEU8AAOAAJvQ29yZSAxNDIgLQAAAARjb3JlAC0gY29weSB0aHJlYWQAMQAACAAABQAAQBRH5AAAANBV9V0AAAAACAEQZAAEN3Rvb15BAADs8S1BwXgAkXLNAfKukEduAEuTA6BbwAAnaS1ugEcAALuI0KxTKAAwFi1HnXCIACEayEx6IgADDK1IU6IAYEYJYcB4AA/pLXXQeAEOTC9VoHgBDdiuweB4AQzcrrnQeAEMGG7B4HgA9eblFkHgBGZi1mVngAkbxkZhcAAyObYXuAA5OXs/y4ALuF13sHgBPhhvHvB4AU5YbtqweAFN1puydB4AVEcLxpweAFSHDcfHHgBUlq1lW4APXm6AZ4AHcZaq8HgBaNw3nbB4AV0Ybx8weAFeGq9TcHgBYBhu9dB4AWDdtfoweAFhXLcKcHgBYZw1fXB4AXecNWDweAF33TXzsHgAHrm5QZ4AWwcNyTweAGEXDVg8HgYbAAAcwNgCRdaDhAAeCADlbBEScC3IlHBoFDiGWGQwDHiq9JvSLyOylSeTkqO6dAw4xm1kHXxGYGFZsBvFw8/Lzbpz/m6tcTX7zep1W2HFgCJF14YgFDjETQunxbpD0A46XK1rKC5eLrYVNufRsb/0vUv/a8///uH7///2+o//HiAqGmh2rLYbCDw3mdjc/fPkCKvEl+/8ggZqZVILf3AmWVMDKpCpqqNAk+4qQVXlcxF1qGMZvH2r6r4gD2tkdxxK5yrq05KKYoqhUhGQomiFBqX4DCJQEom6P//0aaHUaVMJxpq//0aaLRqJtExQpjTRaJomaP88IiJomKCYVNExppoimDFQTNE5+YxMI+U1/KmJhPpqZplMRpk/1MmaaYiPomKYI0JEJ8mmoTCYpiaaYqaJmifmJk0TExMKYmJiCAmTekJGRFIBH0oAcDvLEAGjA/8AEpslVczmImgCMBF8LoBKE0DaXYu0hXWlCbhNw5wCNdrpbvcrqoz+TUfYxJilWV0jFUs0J8sGtzM9N13tqRP1ZLb46hEgyQYXRWOqUYNinmx9L+dGNHegXnydsEnAsVBJmVkub6DiMiswlnpTbeQsAAAsoBAADsCaAAOgVgD4O5AAOgDAHgVwAPADAMAJQABuBOAAGQFYA6DsQAB0AQA8COAAMgGAYANwAA4A0AAXATgADIEYA+D2QAD4BIDwIoAB8AwDAAuBAD9aJZdEOG8rrrII4jeeaA/MLeV8QpTWWdptWELWpVnsnGrOu6YdCgeHlW0gxVYEgbEjBZYdGotLrsuL+dwd2n1DAZpo3WrVVR+vgIJ83JyxHJEpqqRxy2mhzE4j5nJ69pHiaX+C33JbrCXhPNLwcy5QxvHiq4JIak9T5JgbUeJLrsD/y2D+L+++3nwn2+41dTJlr6Vjbylz3PtYsGKz5HNr9lx9IpDoFxDEWiEswRGoIBcEAuJhUIAwsLCzB+GFmL1Fg5g+mDmCB9MwaH0wfTBzB+hg5g+oQEDAQMC4YCLoIhQZKAgYHdD6YPzMGDBgwYMyDgwYMwZkGDMgzIODMtIMybSDMmyLsyzJsg7MuzIMi7Mg7Mg7OuzJ';
    }, 300);
  }
  
  reviewRecording(): void {
    this.showSessionTimePopup = false;
    // Set up the interface for viewing a recording
    this.videoAvailable = true;
    // In a real app, you would load the recording URL
    this.videoSource = '/assets/recordings/session-' + this.session?.id + '.mp4';
  }
  
  prepareSession(): void {
    this.showSessionTimePopup = false;
    // Show session preparation tools - syllabus, materials, etc.
  }
  
  getTimeUntilSession(): string {
    if (!this.session?.startTime) return '';
    
    const now = new Date();
    const sessionStart = new Date(this.session.startTime);
    const diff = sessionStart.getTime() - now.getTime();
    
    // Convert to days/hours/minutes
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  // Add missing methods
leaveSession(): void {
  // Show confirmation dialog instead of immediately leaving
  this.showLeaveConfirmation = true;
}

confirmLeave(shouldLeave: boolean): void {
  this.showLeaveConfirmation = false;
  
  if (shouldLeave) {
    // Stop all media
    this.stopMedia();
    
    // Leave the session via service
    this.videoService.leaveSession().subscribe({
      next: () => {
        // Navigate back to virtual classrooms list
        this.router.navigate(['/teacher/virtual-classrooms']);
      },
      error: (err) => {
        console.error('Error leaving session:', err);
        // Still navigate away even if there's an error
        this.router.navigate(['/teacher/virtual-classrooms']);
      }
    });
  }
}

// Add methods for file handling
triggerFileUpload(): void {
  this.fileInput.nativeElement.click();
}

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    // Check file size
    if (file.size > this.maxFileSize) {
      alert(`File is too large. Maximum size allowed is ${this.formatFileSize(this.maxFileSize)}`);
      return;
    }
    
    this.selectedFile = file;
    console.log('File selected:', this.selectedFile.name);
    
    // Auto-send file when selected
    this.sendFileMessage();
    
    // Clear the input
    input.value = '';
  }
}

sendFileMessage(): void {
  if (!this.selectedFile) return;
  
  this.videoService.sendFileMessage(this.selectedFile);
  this.selectedFile = null;
}

formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Update the sendMessage method to also handle files



}