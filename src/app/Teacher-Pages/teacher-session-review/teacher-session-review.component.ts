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
showSessionTimePopup = true;  // Show popup by default when page loads
isSessionActive = false;
isSessionPast = false;
isSessionFuture = true;
  
  // Subscriptions to clean up
  private subscriptions: Subscription[] = [];

    // In teacher-session-review.component.ts - add this with your other properties
  currentTab: 'analytics' | 'recording' | 'chat' = 'analytics';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoConferenceService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const sessionId = params.get('id');
      if (sessionId) {
        this.currentSessionId = parseInt(sessionId);
        this.loadSessionDetails(this.currentSessionId);
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
  
  loadSessionDetails(sessionId: number): void {
    this.loading = true;
    this.error = null;

    if (sessionId === undefined) {
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
      // Get user media
      this.userStream = await this.videoService.getUserStream();
      
      // Connect stream to video element
      if (this.userVideoElement && this.userVideoElement.nativeElement) {
        this.userVideoElement.nativeElement.srcObject = this.userStream;
      }
      
      // Enable camera and mic by default
      this.cameraEnabled = true;
      this.micEnabled = true;
    } catch (err) {
      console.error('Error initializing media', err);
      // Just show a warning but don't block the interface
      alert('Could not access camera or microphone. Please check permissions.');
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
      this.videoService.stopScreenStream();
      this.screenSharing = false;
      this.screenStream = null;
    } else {
      try {
        this.screenStream = await this.videoService.getScreenStream();
        
        if (this.screenVideoElement && this.screenVideoElement.nativeElement) {
          this.screenVideoElement.nativeElement.srcObject = this.screenStream;
        }
        
        this.screenSharing = true;
      } catch (err) {
        console.error('Error sharing screen', err);
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
    if (!this.newMessage.trim()) return;
    
    this.videoService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
  
  scrollChatToBottom(): void {
    if (this.messagesContainer && this.messagesContainer.nativeElement) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
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
  
  // Add these methods to your component
  closeSessionTimePopup(): void {
    this.showSessionTimePopup = false;
    
    // If session is past, automatically show recording view
    if (this.isSessionPast) {
      this.reviewRecording();
    }
  }
  
  joinLiveSession(): void {
    this.showSessionTimePopup = false;
    // Continue with your existing live session setup
    this.initializeMedia();
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

}