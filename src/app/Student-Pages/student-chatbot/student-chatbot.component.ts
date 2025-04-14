import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewChecked, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { StudentChatbotService, ChatMessage } from '../Student-Services/student-chatbot.service';
import { Subscription } from 'rxjs';

interface QuickQuestion {
  text: string;
  icon: string;
  color?: string;
}

@Component({
  selector: 'app-student-chatbot',
  templateUrl: './student-chatbot.component.html',
  styleUrls: ['./student-chatbot.component.css']
})
export class StudentChatbotComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @Input() sessionData: any = null;
  
  isChatExpanded = false;
  messages: ChatMessage[] = [];
  currentMessage = '';
  isTyping = false;
  private routerSubscription: Subscription;

  // Focus only on two types of questions
  quickQuestions: QuickQuestion[] = [];
  
  // Simplified topic suggestions
  topicSuggestions = {
    sessions: [
      'How do I join a live session?',
      'Where can I watch recordings?',
      'When is my next class?',
      'What equipment do I need for sessions?',
      'Can I download session materials?'
    ],
    tutoring: [
      'How do I find a tutor?',
      'How do I enroll in tutoring?',
      'How much do programs cost?',
      'Can I message my tutor directly?',
      'How long are tutoring programs?'
    ],
    general: [
      'How do I join a live session?',
      'Where can I find tutoring programs?',
      'When is my next class?',
      'How do I enroll in tutoring?'
    ]
  };

  constructor(private router: Router, private chatService: StudentChatbotService) {
    // Subscribe to router events to clear chat history on navigation
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Clear chat when navigating to a new page
        this.chatService.clearHistory();
        this.messages = [];
        this.isChatExpanded = false;
      }
    });
  }
  
  ngOnInit(): void {
    // If no messages, add welcome message
    if (this.messages.length === 0) {
      this.initWelcomeMessage();
    }
  }
  
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
  // Update the welcome message to be simpler
  initWelcomeMessage(): void {
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: `<strong>Welcome to EduNext!</strong> 👋
        <p>I'm <strong>NexGenius</strong>, your AI learning assistant. I can help with Live Sessions and Mentorship Programs.</p>
        <p>What can I help you with today?</p>`,
      timestamp: new Date(),
      isHtml: true,
      category: 'general',

    };
    this.messages = [welcomeMessage];
    this.chatService.clearHistory();
  }
  
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  
  toggleChat(): void {
    this.isChatExpanded = !this.isChatExpanded;
    if (this.isChatExpanded) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }
  
  sendMessage(): void {
    if (!this.currentMessage.trim()) return;
    
    // Add user message to UI
    const userMessage: ChatMessage = {
      role: 'user',
      content: this.currentMessage,
      timestamp: new Date()
    };
    this.messages.push(userMessage);
    
    // Clear input and show typing indicator
    const message = this.currentMessage;
    this.currentMessage = '';
    this.isTyping = true;
    this.scrollToBottom();
    
    // Process via service
    this.chatService.processMessage(message).subscribe(response => {
      this.messages.push(response);
      this.isTyping = false;
      this.scrollToBottom();
    });
  }
  
  sendSuggestion(suggestion: string): void {
    this.currentMessage = suggestion;
    this.sendMessage();
  }
  
  navigateTo(url: string): void {
    this.router.navigate([url]);
  }
  
  clearChat(): void {
    this.chatService.clearHistory();
    this.initWelcomeMessage();
  }
  
  // Visual helper to determine if message should show a tail
  shouldShowTail(msg: ChatMessage, index: number): boolean {
    if (index === 0) return true;
    
    const prevMsg = this.messages[index - 1];
    // Show tail if this message is from a different sender than the previous one
    return prevMsg.role !== msg.role;
  }
  
  // Enhanced method to get related suggestions for any message
  getRelatedSuggestions(category?: string): string[] {
    if (!category) {
      // If no category, return the default general suggestions
      return this.topicSuggestions.general;
    }
    
    // Return category-specific suggestions, or general if category not found
    return this.topicSuggestions[category as keyof typeof this.topicSuggestions] || 
           this.topicSuggestions.general;
  }
  
  // Keep the original method for backwards compatibility
  getContextSuggestions(): string[] {
    if (this.messages.length < 2) return [];
    
    const lastAssistantMsg = [...this.messages]
      .reverse()
      .find(msg => msg.role === 'assistant');
    
    if (!lastAssistantMsg?.category) return [];
    
    return this.getRelatedSuggestions(lastAssistantMsg.category);
  }
  
  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }
}