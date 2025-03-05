import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentVirtualClassroomService } from '../Student-Services/student-vritual-classroom-services.service';
import { ClassroomSession } from '../student-virtual-classroom-sessions/student-virtual-classroom-session.model';
import { ViewChild, ElementRef } from '@angular/core';



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
  

  
  @ViewChild('screenVideo') screenVideoElement: ElementRef<HTMLVideoElement> | undefined;
  @ViewChild('messagesContainer') messagesContainer: ElementRef<HTMLDivElement> | undefined;




  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classroomService: StudentVirtualClassroomService
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
  }
  
  loadSessionDetails(): void {
    this.loading = true;
    this.error = null;
    
    // In a real app, you'd make a specific API call to get session details
    this.classroomService.getAvailableSessions().subscribe({
      next: (sessions: ClassroomSession[]) => {
        const currentSession = sessions.find(s => s.idSession === this.sessionId);
        if (currentSession) {
          this.session = currentSession;
          
          // Check if session is live
          if (currentSession.status !== 'live') {
            this.error = "This session is not currently live";
          } else {
            this.startVideoSession();
            this.setupMockParticipants();
            this.loadInitialMessages();
          }
        } else {
          this.error = "Session not found";
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = `Error loading session: ${err.message}`;
        this.loading = false;
      }
    });
  }
  
  startVideoSession(): void {
    // In a real app, you'd connect to a video service like Twilio, Agora, etc.
    setTimeout(() => {
      this.videoStarted = true;
    }, 1500);
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
  
  toggleCamera(): void {
    this.cameraEnabled = !this.cameraEnabled;
    // In a real app, actually turn camera on/off
  }
  
  toggleMic(): void {
    this.micEnabled = !this.micEnabled;
    // In a real app, actually turn mic on/off
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
  ngOnDestroy(): void {
    // Stop screen sharing if active
    if (this.screenSharing && this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
    }
  }

  ngAfterViewChecked() {
    if (this.screenVideoElement && this.screenStream && 
        this.screenVideoElement.nativeElement.srcObject !== this.screenStream) {
      this.screenVideoElement.nativeElement.srcObject = this.screenStream;
    }
  }



}