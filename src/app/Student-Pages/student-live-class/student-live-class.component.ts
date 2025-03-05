import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentVirtualClassroomService } from '../Student-Services/student-vritual-classroom-services.service';
import { ClassroomSession } from '../student-virtual-classroom-sessions/student-virtual-classroom-session.model';
import { ViewChild, ElementRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import emailjs from '@emailjs/browser';


import { FeedBackService } from '../../backend/VirtualClassroom-Admin/VirtualClassroom-Services/feed-back.service';
import { Feedback } from '../../backend/VirtualClassroom-Admin/feed-back/feed-back.model';



@Component({
  selector: 'app-student-live-class',
  templateUrl: './student-live-class.component.html',
  styleUrls: ['./student-live-class.component.css']
})
export class StudentLiveClassComponent implements OnInit {
  sessionId: number = 0;
  session: ClassroomSession | null = null;
  loading: boolean = true;
  error: string | null = null;
  
  // Chat messages
  messages: { sender: string; content: string; timestamp: Date }[] = [];
  newMessage: string = '';
  
  // Video states
  videoStarted: boolean = false;
  cameraEnabled: boolean = true;
  micEnabled: boolean = true;
  
  // Participants
  participants: { name: string; micOn: boolean; videoOn: boolean; }[] = [];
  

  //Live Class Camera & Micro 
  userStream: MediaStream | null = null;

  //Feedback
  viewMode: 'live' | 'completed' = 'live';
  showFeedbackModal: boolean = false;
  sessionFeedback: Feedback[] = [];
  averageRating: number = 0;

  //Email
  emailAddress: string = '';
  showJoinModal: boolean = false;
  
  @ViewChild('screenVideo') screenVideoElement: ElementRef<HTMLVideoElement> | undefined;
  @ViewChild('messagesContainer') messagesContainer: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('userVideo') userVideoElement: ElementRef<HTMLVideoElement> | undefined;




  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classroomService: StudentVirtualClassroomService,
    private feedbackService: FeedBackService,  // Use the existing service
    private http: HttpClient  // Add this line


  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sessionId = +params['id']; // Convert to number with +
      if (isNaN(this.sessionId)) {
        this.error = "Invalid session ID";
        this.loading = false;
        return;
      }
      
      this.loadSessionDetails();
    });
    
    // Initialize EmailJS
    emailjs.init("mp4opsuYaJa1NMSqU"); // Replace with your actual public key
  }
  
  // Update the loadSessionDetails method with this fix:
  loadSessionDetails(): void {
    this.loading = true;
    this.error = null;
    
    this.classroomService.getAvailableSessions().subscribe({
      next: (sessions: ClassroomSession[]) => {
        const currentSession = sessions.find(s => s.idSession === this.sessionId);
        if (currentSession) {
          this.session = currentSession;
          
          // Updated status check to handle completed sessions
          if (currentSession.status === 'completed') {
            this.viewMode = 'completed';
            this.loading = false;
          } else if (currentSession.status === 'live') {
            this.viewMode = 'live';
            this.startVideoSession();
            this.setupMockParticipants();
            this.loadInitialMessages();
            this.loading = false;  // ADD THIS LINE - it was missing!
          } else {
            this.error = "This session is not currently available";
            this.loading = false;
          }
        } else {
          this.error = "Session not found";
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = `Error loading session: ${err.message}`;
        this.loading = false;
      }
    });
  }
  
  startVideoSession(): void {
    // Start instructor's video (simulated)
    setTimeout(() => {
      this.videoStarted = true;
    }, 1500);
    
    // Start user's camera/mic
    this.initializeUserMedia();
  }

  async initializeUserMedia(): Promise<void> {
    try {
      // Request access to camera and microphone
      this.userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      // Set initial mic state (everything starts enabled)
      this.cameraEnabled = true;
      this.micEnabled = true;
      
      // Update UI after a short delay to ensure DOM has updated
      setTimeout(() => {
        if (this.userVideoElement && this.userStream) {
          this.userVideoElement.nativeElement.srcObject = this.userStream;
        }
      }, 100);
      
    } catch (err) {
      console.error('Error accessing user media:', err);
      // If permission denied, update UI state
      this.cameraEnabled = false;
      this.micEnabled = false;
      
      this.messages.push({
        sender: 'System',
        content: 'Could not access camera or microphone. Please check permissions.',
        timestamp: new Date()
      });
    }
  }

  
  
  // Replace your current sendMessage() method with this simplified version
  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    
    this.messages.push({
      sender: 'You',
      content: this.newMessage,
      timestamp: new Date()
    });
    
    this.newMessage = '';
    
    // Scroll to bottom after a short delay to ensure the DOM has updated
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }
  
  // Replace the existing toggle methods
  toggleCamera(): void {
    this.cameraEnabled = !this.cameraEnabled;
    
    // If we have a stream, toggle video tracks
    if (this.userStream) {
      this.userStream.getVideoTracks().forEach(track => {
        track.enabled = this.cameraEnabled;
      });
      
      // Add system message
      this.messages.push({
        sender: 'System',
        content: this.cameraEnabled ? 'Camera turned on.' : 'Camera turned off.',
        timestamp: new Date()
      });
      
      this.scrollToBottom();
    } else if (this.cameraEnabled) {
      // If trying to enable camera but no stream exists
      this.initializeUserMedia();
    }
  }
  
  toggleMic(): void {
    this.micEnabled = !this.micEnabled;
    
    // If we have a stream, toggle audio tracks
    if (this.userStream) {
      this.userStream.getAudioTracks().forEach(track => {
        track.enabled = this.micEnabled;
      });
      
      // Add system message
      this.messages.push({
        sender: 'System',
        content: this.micEnabled ? 'Microphone turned on.' : 'Microphone turned off.',
        timestamp: new Date()
      });
      
      this.scrollToBottom();
    }
  }
  
  // Add this property to your component
  showLeaveConfirmation: boolean = false;
  
  // Replace leaveSession() method with these two methods
  leaveSession(): void {
    this.showLeaveConfirmation = true;
  }
  
  confirmLeave(confirmed: boolean): void {
    if (confirmed) {
      // Add a small delay for better UX
      setTimeout(() => {
        this.router.navigate(['/student-virtual-classroom-sessions']);
      }, 300);
    }
    this.showLeaveConfirmation = false;
  }
  
  private loadInitialMessages(): void {
    // Only add a welcome message
    this.messages = [
      {
        sender: this.session?.instructorName || 'Instructor',
        content: 'Welcome to the live session! Feel free to ask questions in the chat.',
        timestamp: new Date()
      }
    ];
  }
  
  private setupMockParticipants(): void {
    this.participants = [

    ];
  }

    // Add these properties
  handRaised: boolean = false;
  screenSharing: boolean = false;
  
  // Add these methods
  toggleRaiseHand(): void {
    this.handRaised = !this.handRaised;
    
    if (this.handRaised) {
      this.messages.push({
        sender: 'System',
        content: 'You raised your hand. The instructor has been notified.',
        timestamp: new Date()
      });
      
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
  }

  // Add this new method
private scrollToBottom(): void {
  if (this.messagesContainer) {
    const element = this.messagesContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
}
  

    // Add these properties to track screen share state and stream
  screenStream: MediaStream | null = null;
  
  // Update the toggleScreenShare method
  async toggleScreenShare():Promise<void>{
    try {
      if (!this.screenSharing) {
        // Start screen sharing
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { 
            cursor: "always" 
          }as MediaTrackConstraints,
          audio: false
        });
        
        // Successfully got screen capture stream
        this.screenSharing = true;
        
        // Add message to chat
        this.messages.push({
          sender: 'System',
          content: 'You started sharing your screen.',
          timestamp: new Date()
        });
        
        // Set up listener for when user stops sharing via browser controls
        this.screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          this.stopScreenSharing();
        });
      } else {
        // Stop screen sharing
        this.stopScreenSharing();
      }
    } catch (err) {
      console.error('Error sharing screen:', err);
      this.messages.push({
        sender: 'System',
        content: 'Failed to share screen: ' + (err instanceof Error ? err.message : 'Unknown error'),
        timestamp: new Date()
      });
    }
  }
  
  // Add method to stop screen sharing
  stopScreenSharing(): void {
    if (this.screenStream) {
      // Stop all tracks
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }
    
    this.screenSharing = false;
    
    // Add message to chat
    this.messages.push({
      sender: 'System',
      content: 'You stopped sharing your screen.',
      timestamp: new Date()
    });
  }
  
  // Clean up resources when component is destroyed
  // Update ngOnDestroy to cleanup all media resources
  ngOnDestroy(): void {
    // Stop screen sharing if active
    if (this.screenSharing && this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
    }
    
    // Stop user media if active
    if (this.userStream) {
      this.userStream.getTracks().forEach(track => track.stop());
    }
  }

  ngAfterViewChecked() {
    if (this.screenVideoElement && this.screenStream && 
        this.screenVideoElement.nativeElement.srcObject !== this.screenStream) {
      this.screenVideoElement.nativeElement.srcObject = this.screenStream;
    }
  }

  showFeedback(): void {
    this.loading = true;
    
    // First get all feedbacks, then filter for this session
    this.feedbackService.getFeedbacks().subscribe({
      next: (allFeedback: Feedback[]) => {
        // Filter feedbacks that match this session ID
        this.sessionFeedback = allFeedback.filter(feedback => {
          const feedbackSessionId = typeof feedback.session === 'number' 
            ? feedback.session 
            : (feedback.session as any)?.idSession;
          
          return feedbackSessionId === this.sessionId;
        });
        
        // Calculate average rating
        if (this.sessionFeedback.length > 0) {
          const sum = this.sessionFeedback.reduce((acc, fb) => acc + fb.rating, 0);
          this.averageRating = sum / this.sessionFeedback.length;
        }
        
        this.showFeedbackModal = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading feedback:', err);
        this.error = 'Failed to load session feedback';
        this.loading = false;
      }
    });
  }

    closeFeedbackModal(): void {
    this.showFeedbackModal = false;
  }
  
  // Add helper method for star ratings
  getRatingArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < Math.round(rating) ? 1 : 0);
  }
  
    // Add these properties right after your existing properties
  reminderEmail: string = '';
  showEmailModal: boolean = false;
  sendingEmail: boolean = false;
  emailStatus: { success: boolean; message: string } | null = null;
  
  // Add these methods right after closeFeedbackModal
  openEmailModal(): void {
    console.log('Opening email modal');
    this.showEmailModal = true;
    this.emailStatus = null;
  }

  closeEmailModal(): void {
    this.showEmailModal = false;
    this.reminderEmail = '';
    this.emailStatus = null;
  }
  
  sendReminderEmail(): void {
    if (!this.reminderEmail || !this.validateEmail(this.reminderEmail)) {
      this.emailStatus = {
        success: false,
        message: 'Please enter a valid email address'
      };
      return;
    }
    
    this.sendingEmail = true;
    this.emailStatus = null;
    
    // EmailJS template parameters
    const templateParams = {
      to_email: this.reminderEmail,
      session_title: this.session?.titleSession,
      instructor_name: this.session?.instructorName,
      session_date: this.session?.startTime ? new Date(this.session.startTime).toLocaleString() : 'Upcoming session',
      session_id: this.sessionId
    };
  
    // Send email using EmailJS
    emailjs.send(
      'service_3h2lycg',        // Replace with your service ID from EmailJS dashboard
      'template_ifqwrsm',       // Replace with your template ID
      templateParams,
      'mp4opsuYaJa1NMSqU'         // Replace with your public key
    )
    .then((response) => {
      console.log('Email sent successfully!', response);
      this.sendingEmail = false;
      this.emailStatus = {
        success: true,
        message: 'Reminder email sent successfully! Check your inbox.'
      };
      
      setTimeout(() => {
        this.closeEmailModal();
      }, 2000);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      this.sendingEmail = false;
      this.emailStatus = {
        success: false,
        message: 'Failed to send email. Please try again.'
      };
    });
  }
  


  // Add this method for email validation
validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Add this method to handle the sign up button click
sendSignupEmail(): void {
  if (!this.emailAddress || !this.validateEmail(this.emailAddress)) {
    this.emailStatus = {
      success: false,
      message: 'Please enter a valid email address'
    };
    return;
  }
  
  this.sendingEmail = true;
  this.emailStatus = null;
  
  // EmailJS template parameters for signup notification
  const templateParams = {
    to_email: this.emailAddress,
    session_title: this.session?.titleSession || "Requested Session",
    instructor_name: this.session?.instructorName || "Our Instructor",
    message: `You will be notified when the session "${this.session?.titleSession}" becomes available.`,
  };

  // Send email using EmailJS
  emailjs.send(
    'service_het4ipw', // Replace with your service ID
    'template_s9fn0ie', // Replace with your template ID
    templateParams,
    'mp4opsuYaJa1NMSqU' // Replace with your public key
  )
  .then((response) => {
    console.log('Signup email sent successfully!', response);
    this.sendingEmail = false;
    this.emailStatus = {
      success: true,
      message: 'You\'ve been registered! Check your inbox for confirmation.'
    };
    
    // Close the modal after a short delay
    setTimeout(() => {
      this.closeJoinModal();
    }, 2000);
  })
  .catch((error) => {
    console.error('Error sending signup email:', error);
    this.sendingEmail = false;
    this.emailStatus = {
      success: false,
      message: 'Failed to register. Please try again.'
    };
  });
}

openJoinModal(): void {
  console.log('Opening join modal');
  this.showJoinModal = true;
  this.emailStatus = null;
  this.emailAddress = '';
}

closeJoinModal(): void {
  this.showJoinModal = false;
  this.emailAddress = '';
  this.emailStatus = null;
}




}