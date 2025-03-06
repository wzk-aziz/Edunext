import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Participant {
  id: number;
  name: string;
  isTeacher: boolean;
  isMuted: boolean;
  hasCamera: boolean;
  isVideoOn: boolean;
  handRaised?: boolean;
  stream?: MediaStream;
}

export interface ChatMessage {
  sender: string;
  time: string;
  content: string;
  isTeacher?: boolean;
  isSystem?: boolean;
}

export interface SessionInfo {
  id: number;
  title: string;
  subject?: string;
  startTime: Date;
  duration: number;
  status: 'scheduled' | 'ongoing' | 'completed';
  instructorId: number;
  instructorName: string;
  enrolledStudents: number;
  zoomLink?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoConferenceService {
  private userStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private localParticipant: Participant | null = null;
  
  // Observable sources
  private participantsSubject = new BehaviorSubject<Participant[]>([]);
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private sessionSubject = new BehaviorSubject<SessionInfo | null>(null);
  private connectionStatusSubject = new BehaviorSubject<'connecting' | 'connected' | 'disconnected'>('disconnected');
  
  // Observable streams
  public participants$ = this.participantsSubject.asObservable();
  public messages$ = this.messagesSubject.asObservable();
  public session$ = this.sessionSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {}

  // Session management
  public joinSession(sessionId: number, isTeacher: boolean): Observable<boolean> {
    this.connectionStatusSubject.next('connecting');
    
    // In a real implementation, this would connect to your video API
    // For now, we'll simulate with a mock implementation
    return of(true).pipe(delay(1500)).pipe(response => {
      // Set up mock data
      const mockSession: SessionInfo = {
        id: sessionId,
        title: 'Introduction to Angular Development',
        subject: 'Web Development',
        startTime: new Date(),
        duration: 60,
        status: 'ongoing',
        instructorId: 1,
        instructorName: 'John Doe',
        enrolledStudents: 25
      };
      this.sessionSubject.next(mockSession);
      
      // Create mock participants
      const participants: Participant[] = [];
      
      // Teacher is always participant 1
      const teacher: Participant = {
        id: 1,
        name: 'John Doe',
        isTeacher: true,
        isMuted: false,
        hasCamera: true,
        isVideoOn: true
      };
      
      participants.push(teacher);
      
      // Add some students
      for (let i = 0; i < 5; i++) {
        participants.push({
          id: i + 2,
          name: `Student ${i + 1}`,
          isTeacher: false,
          isMuted: Math.random() > 0.5,
          hasCamera: Math.random() > 0.3,
          isVideoOn: Math.random() > 0.4
        });
      }
      
      this.participantsSubject.next(participants);
      
      // Set the local participant based on role
      this.localParticipant = isTeacher ? teacher : participants.find(p => !p.isTeacher) || null;
      
      // Add system message
      this.addSystemMessage(`${isTeacher ? 'Teacher' : 'Student'} joined the session`);
      
      this.connectionStatusSubject.next('connected');
      return response;
    });
  }

  public leaveSession(): Observable<boolean> {
    // Clean up streams
    this.stopUserStream();
    this.stopScreenStream();
    
    // Add system message
    this.addSystemMessage(`${this.localParticipant?.isTeacher ? 'Teacher' : 'Student'} left the session`);
    
    // Reset state
    this.localParticipant = null;
    this.participantsSubject.next([]);
    this.connectionStatusSubject.next('disconnected');
    
    return of(true);
  }

  // Media stream handling
  public async getUserStream(): Promise<MediaStream> {
    if (this.userStream) {
      return this.userStream;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      this.userStream = stream;
      
      // Update participant status
      if (this.localParticipant) {
        this.localParticipant.hasCamera = true;
        this.localParticipant.isVideoOn = true;
        this.localParticipant.isMuted = false;
        this.updateParticipantInList(this.localParticipant);
      }
      
      return stream;
    } catch (error) {
      console.error('Error getting user media', error);
      throw error;
    }
  }

  public async getScreenStream(): Promise<MediaStream> {
    if (this.screenStream) {
      return this.screenStream;
    }
    
    try {
      // @ts-ignore: TypeScript doesn't know about this API yet
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      
      this.screenStream = stream;
      
      // Listen for when user stops sharing
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopScreenStream();
      };
      
      return stream;
    } catch (error) {
      console.error('Error getting screen media', error);
      throw error;
    }
  }

  public stopUserStream() {
    if (this.userStream) {
      this.userStream.getTracks().forEach(track => track.stop());
      this.userStream = null;
      
      // Update participant status
      if (this.localParticipant) {
        this.localParticipant.isVideoOn = false;
        this.updateParticipantInList(this.localParticipant);
      }
    }
  }

  public stopScreenStream() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }
  }

  public toggleVideo(enabled: boolean): void {
    if (this.userStream) {
      const videoTracks = this.userStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = enabled;
      });
      
      // Update participant status
      if (this.localParticipant) {
        this.localParticipant.isVideoOn = enabled;
        this.updateParticipantInList(this.localParticipant);
      }
    }
  }

  public toggleAudio(enabled: boolean): void {
    if (this.userStream) {
      const audioTracks = this.userStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = enabled;
      });
      
      // Update participant status
      if (this.localParticipant) {
        this.localParticipant.isMuted = !enabled;
        this.updateParticipantInList(this.localParticipant);
      }
    }
  }

  // Chat functionality
  public sendMessage(content: string): void {
    if (!content.trim() || !this.localParticipant) return;
    
    const message: ChatMessage = {
      sender: this.localParticipant.name,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      content: content,
      isTeacher: this.localParticipant.isTeacher
    };
    
    const messages = this.messagesSubject.getValue();
    this.messagesSubject.next([...messages, message]);
  }

  private addSystemMessage(content: string): void {
    const message: ChatMessage = {
      sender: 'System',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      content: content,
      isSystem: true
    };
    
    const messages = this.messagesSubject.getValue();
    this.messagesSubject.next([...messages, message]);
  }

  // Participant management
  public toggleHandRaise(raised: boolean): void {
    if (this.localParticipant) {
      this.localParticipant.handRaised = raised;
      this.updateParticipantInList(this.localParticipant);
      
      // Notify others via system message
      if (raised) {
        this.addSystemMessage(`${this.localParticipant.name} raised their hand`);
      } else {
        this.addSystemMessage(`${this.localParticipant.name} lowered their hand`);
      }
    }
  }

  private updateParticipantInList(participant: Participant): void {
    const participants = this.participantsSubject.getValue();
    const index = participants.findIndex(p => p.id === participant.id);
    
    if (index !== -1) {
      participants[index] = {...participant};
      this.participantsSubject.next([...participants]);
    }
  }

  // Mock data methods for testing UI
  public loadMockMessages(): void {
    const isTeacher = this.localParticipant?.isTeacher || false;
    
    const messages: ChatMessage[] = [
      {
        sender: isTeacher ? 'John Doe (You)' : 'John Doe',
        time: '10:00',
        content: 'Welcome everyone to our session on Angular Development!',
        isTeacher: true
      },
      {
        sender: 'Student 1',
        time: '10:05',
        content: 'Looking forward to learning more about components'
      },
      {
        sender: 'Student 2',
        time: '10:07',
        content: 'Will we cover dependency injection today?'
      },
      {
        sender: isTeacher ? 'John Doe (You)' : 'John Doe',
        time: '10:08',
        content: 'Yes, dependency injection is a core topic for today\'s session.',
        isTeacher: true
      },
      {
        sender: 'System',
        time: '10:10',
        content: 'Student 3 joined the session',
        isSystem: true
      },
      {
        sender: 'Student 3',
        time: '10:10',
        content: 'Sorry I\'m late!'
      },
      {
        sender: 'Student 5',
        time: '10:15',
        content: 'Could you explain dependency injection again?'
      }
    ];
    
    this.messagesSubject.next(messages);
  }
}