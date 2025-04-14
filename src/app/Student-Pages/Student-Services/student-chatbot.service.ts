import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, switchMap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  links?: {text: string, url: string, icon: string}[];
  category?: string;
  isHtml?: boolean;
}

interface ResponseTemplate {
  content: string;
  links?: {text: string, url: string, icon: string}[];
  isHtml?: boolean;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentChatbotService {
  private chatHistory: ChatMessage[] = [];
  private apiKey = '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'; // Replace with your actual token
  private apiUrl = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

  // Remove these lines from your systemPrompt
  private systemPrompt = `You are NexGenius, an AI assistant for the EduNext education platform. 
  You help students navigate the platform with a focus on two main areas:
  
  1. Live Sessions - Interactive online classes with instructors
  2. Mentorship Programs - One-on-one tutoring with experts
  
  Keep your responses brief (under 80 words). Respond in a friendly, helpful manner.
  
  Format your responses with HTML when appropriate using <p>, <strong>, or <ul>/<li> tags.
  
  Do not include links or action buttons in your responses. Just provide the information directly.`;
  // Pre-defined response templates for fallback
  private responses: {[key: string]: ResponseTemplate} = {
    fallback: {
      content: "I'm here to help with Live Sessions and Mentorship Programs. What would you like to know?",
      links: [
        {text: 'Live Sessions', url: '/student/virtual-classroom-sessions', icon: 'fa-video'},
        {text: 'Mentorship Programs', url: '/student/tutoring', icon: 'fa-user-tie'}
      ],
      isHtml: false,
      category: 'general'
    },
    sessions_info: {
      content: 'Our <strong>Live Sessions</strong> feature allows you to join interactive classes with expert instructors in real-time. You can participate in discussions, ask questions, and collaborate with peers. All sessions are also recorded for later viewing.',
      links: [
        {text: 'Explore Live Sessions', url: '/student/virtual-classroom-sessions', icon: 'fa-video'}
      ],
      isHtml: true,
      category: 'sessions'
    },
    tutoring_info: {
      content: 'Our <strong>Mentorship Programs</strong> connect you with industry experts who can guide your learning journey. Programs include one-on-one sessions, personalized feedback, and career guidance tailored to your goals.',
      links: [
        {text: 'Explore Mentorship Programs', url: '/student/tutoring', icon: 'fa-user-tie'}
      ],
      isHtml: true,
      category: 'tutoring'
    },
    session_join: {
      content: 'To join a live session, look for the "LIVE NOW" badge on your dashboard and click the green "Join Session" button. This will take you directly to the virtual classroom.',
      links: [
        {text: 'Go to Live Sessions', url: '/student/virtual-classroom-sessions', icon: 'fa-video'}
      ],
      category: 'sessions'
    },
    session_recordings: {
      content: 'You can find all recorded sessions in the "Past Sessions" section of your Virtual Classroom page. Recordings are available for 30 days after the live class.',
      links: [
        {text: 'View Recordings', url: '/student/virtual-classroom-sessions', icon: 'fa-play-circle'}
      ],
      category: 'sessions'
    },
    session_next: {
      content: 'You can view all your upcoming sessions on the Virtual Classroom page. Each session includes details about the topic and instructor.',
      links: [
        {text: 'Check Upcoming Sessions', url: '/student/virtual-classroom-sessions', icon: 'fa-calendar-alt'}
      ],
      category: 'sessions'
    },
    tutoring_programs: {
      content: 'We offer various mentorship programs with industry experts. You can browse all available programs, filter by subject, and enroll directly on the Tutoring page.',
      links: [
        {text: 'View Tutoring Programs', url: '/student/tutoring', icon: 'fa-user-tie'}
      ],
      category: 'tutoring'
    },
    tutoring_enroll: {
      content: 'To enroll in a tutoring program, visit the Tutoring page, browse the available programs, and click "Enroll Now" on the program that interests you.',
      links: [
        {text: 'Browse Programs', url: '/student/tutoring', icon: 'fa-user-plus'}
      ],
      category: 'tutoring'
    },
    tutoring_cost: {
      content: 'Tutoring program prices vary based on subject, duration, and instructor. All pricing details are clearly listed on each program card on the Tutoring page.',
      links: [
        {text: 'View Program Pricing', url: '/student/tutoring', icon: 'fa-tag'}
      ],
      category: 'tutoring'
    }
  };
  
  constructor(private http: HttpClient) {
    // No need to load from localStorage since we're resetting on navigation
  }
  
  // Method to process user message and get a response
  processMessage(message: string): Observable<ChatMessage> {
    // Save user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    this.chatHistory.push(userMessage);
    
    // Add a brief delay to simulate typing start
    return of(null).pipe(
      delay(300),
      switchMap(() => {
        // Call OpenAI with conversation history
        return this.useAiResponse().pipe(
          catchError(error => {
            console.error('Error calling AI service:', error);
            console.error('Error details:', error.error);
            // Fall back to static responses if AI fails
            return this.useStaticResponse(message);
          })
        );
      })
    );
  }
  
  // Use AI to generate a response
  // Replace your current useAiResponse method with this:
  private useAiResponse(): Observable<ChatMessage> {
    // Format conversation for Mistral
    const prompt = this.formatConversationForHF();
    
    // Set up API call for Hugging Face
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.apiKey}`);
    
    const body = {
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.7,
        return_full_text: false
      }
    };
    
    console.log('Sending to Hugging Face:', body); // Debug log
    
    // Make the API call
    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      switchMap(response => {
        console.log('Hugging Face response:', response); // Debug log
        
        // Extract the generated text from the response
        const aiResponse = response[0]?.generated_text || '';
        
        // Extract any action links from the response
        const links = this.extractLinksFromResponse(aiResponse);
        const cleanedResponse = this.removeActionLinks(aiResponse);
        
        // Determine category based on content
        const category = this.determineCategoryFromResponse(aiResponse);
        
        // Create and return the assistant message
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: cleanedResponse,
          timestamp: new Date(),
          links: links.length > 0 ? links : undefined,
          isHtml: this.containsHtmlTags(cleanedResponse),
          category: category
        };
        
        // Save to history
        this.chatHistory.push(assistantMessage);
        
        return of(assistantMessage);
      }),
      catchError(error => {
        console.error('Hugging Face API call failed:', error);
        if (error.error) {
          console.error('Error details:', error.error);
        }
        throw error; // Re-throw to be caught by outer handler
      })
    );
  }
  
  // Add this new method to format the conversation history for Hugging Face
  private formatConversationForHF(): string {
    let formattedPrompt = this.systemPrompt + "\n\n";
    
    // Add recent messages
    const recentMessages = this.chatHistory.slice(-5);
    recentMessages.forEach(msg => {
      if (msg.role === 'user') {
        formattedPrompt += `Human: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        formattedPrompt += `Assistant: ${msg.content}\n`;
      }
    });
    
    // Add final instruction
    if (this.chatHistory.length > 0 && this.chatHistory[this.chatHistory.length - 1].role === 'user') {
      formattedPrompt += "Assistant: ";
    }
    
    return formattedPrompt;
  }
  
  // Prepare messages for OpenAI API
  private prepareMessagesForApi(): any[] {
    // Start with system message
    const messages = [
      { role: 'system', content: this.systemPrompt }
    ];
    
    // Add recent conversation history (last 10 messages)
    const recentMessages = this.chatHistory.slice(-10);
    recentMessages.forEach(msg => {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    });
    
    return messages;
  }
  
  // Fall back to static responses if AI fails
  private useStaticResponse(message: string): Observable<ChatMessage> {
    const response = this.generateStaticResponse(message);
    
    return of<ChatMessage>({
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      links: response.links,
      isHtml: response.isHtml,
      category: response.category
    }).pipe(delay(800)); // Add delay to simulate thinking
  }
  
  // Extract links from AI response
  private extractLinksFromResponse(response: string): {text: string, url: string, icon: string}[] {
    const links: {text: string, url: string, icon: string}[] = [];
    const linkRegex = /ACTION_LINK: (.*?)\|(.*?)\|(.*?)(?:\n|$)/g;
    
    let match;
    while ((match = linkRegex.exec(response)) !== null) {
      links.push({
        text: match[1],
        url: match[2],
        icon: match[3]
      });
    }
    
    return links;
  }
  
  // Remove action links from response text
  private removeActionLinks(response: string): string {
    return response.replace(/ACTION_LINK: .*?(?:\n|$)/g, '').trim();
  }
  
  // Check if the response contains HTML
  private containsHtmlTags(text: string): boolean {
    return /<\/?[a-z][\s\S]*>/i.test(text);
  }
  
  // Determine response category based on content
  private determineCategoryFromResponse(response: string): string {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('live session') || 
        lowerResponse.includes('virtual classroom') ||
        lowerResponse.includes('class')) {
      return 'sessions';
    }
    
    if (lowerResponse.includes('mentorship') || 
        lowerResponse.includes('tutor')) {
      return 'tutoring';
    }
    
    return 'general';
  }
  
  // Generate static response based on keywords (fallback)
  private generateStaticResponse(message: string): ResponseTemplate {
    const lowerMessage = message.toLowerCase();
    
    // Add logic for the general info questions
    if (/\b(tell|about|what are|explain)\b.*\b(live session|class|online class)\b/i.test(lowerMessage)) {
      return this.responses['sessions_info'];
    }
    
    if (/\b(tell|about|what are|explain)\b.*\b(mentorship|tutoring|mentor|tutor)\b/i.test(lowerMessage)) {
      return this.responses['tutoring_info'];
    }
    
    // Sessions related keywords
    if (/\b(join|entering|attend|access)\b.*\b(session|class|meeting|webinar|live)\b/i.test(lowerMessage)) {
      return this.responses['session_join'];
    }
    
    if (/\b(recording|recorded|watch|replay|past)\b.*\b(session|class|lecture|course)\b/i.test(lowerMessage)) {
      return this.responses['session_recordings'];
    }
    
    if (/\b(next|upcoming|schedule|when)\b.*\b(session|class|course)\b/i.test(lowerMessage)) {
      return this.responses['session_next'];
    }
    
    // Tutoring related keywords
    if (/\b(find|available|browse|list|see)\b.*\b(tutor|tutoring|mentorship|program)\b/i.test(lowerMessage)) {
      return this.responses['tutoring_programs'];
    }
    
    if (/\b(enroll|sign up|register|join)\b.*\b(tutor|tutoring|mentorship|program)\b/i.test(lowerMessage)) {
      return this.responses['tutoring_enroll'];
    }
    
    if (/\b(cost|price|fee|pay|expensive)\b.*\b(tutor|tutoring|mentorship|program)\b/i.test(lowerMessage)) {
      return this.responses['tutoring_cost'];
    }
    
    // Default fallback
    return this.responses['fallback'];
  }
  
  getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }
  
  clearHistory(): void {
    this.chatHistory = [];
    // No need to clear localStorage since we're not using it
  }
  
  // No need for saveHistory since we're not persisting between navigations
}