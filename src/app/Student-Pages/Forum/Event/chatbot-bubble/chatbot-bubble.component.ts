import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../../models/event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatbot-bubble',
  templateUrl: './chatbot-bubble.component.html',
  styleUrls: ['./chatbot-bubble.component.css']
})
export class ChatbotBubbleComponent implements OnInit {
  isOpen = false;
  messages: {text: string, isBot: boolean}[] = [];
  userInput = '';
  events: Event[] = [];
  isTyping = false;

  // Predefined responses about events and site
  botResponses = {
    welcome: "Bonjour ! Je suis EventBot, votre assistant virtuel. Je peux vous aider à découvrir nos événements et hackathons. Que voulez-vous savoir ?",
    events: "Nous organisons régulièrement des hackathons, des ateliers tech, et des conférences thématiques pour la communauté étudiante et professionnelle. Utilisez les filtres en haut pour trouver un événement qui vous intéresse !",
    registration: "L'inscription est simple ! Cliquez sur 'View Details' pour l'événement qui vous intéresse, puis sur le bouton d'inscription. Vous recevrez une confirmation par email.",
    about: "Notre plateforme connecte les passionnés de technologie et d'innovation. Nous facilitons la participation à des événements enrichissants pour développer vos compétences et élargir votre réseau professionnel.",
    location: "Nos événements se déroulent dans différentes villes. Pour voir les événements dans une ville spécifique, utilisez le filtre de localisation en haut de la page.",
    contact: "Vous avez une question spécifique ? Contactez-nous à support@eventhub.com ou utilisez notre formulaire de contact accessible depuis le footer du site.",
    default: "Désolé, je n'ai pas compris. Pourriez-vous reformuler ou poser une question sur nos événements, l'inscription, ou notre plateforme ?"
  };

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    // Charger les événements pour pouvoir les suggérer
    this.eventService.getEvents().subscribe(data => {
      this.events = data;
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.addBotMessage(this.botResponses.welcome);
    }
  }

  sendMessage(): void {
    if (this.userInput.trim() === '') return;
    
    // Add user message to chat
    this.messages.push({text: this.userInput, isBot: false});
    
    // Process user input and respond
    this.processUserInput(this.userInput.toLowerCase());
    
    // Clear the input field
    this.userInput = '';
  }

  processUserInput(input: string): void {
    this.isTyping = true;
    
    setTimeout(() => {
      this.isTyping = false;
      
      // Check for event-specific query first
      if (input.includes('prochain') || input.includes('bientôt') || input.includes('à venir')) {
        this.suggestUpcomingEvents();
      } else if (input.includes('populaire') || input.includes('recommand')) {
        this.suggestPopularEvents();
      } else if (input.includes('événement') || input.includes('hackathon') || 
                input.includes('evenement') || input.includes('event')) {
        this.addBotMessage(this.botResponses.events);
      } else if (input.includes('inscri') || input.includes('particip') ||
                input.includes('rejoin') || input.includes('inscrire')) {
        this.addBotMessage(this.botResponses.registration);
      } else if (input.includes('site') || input.includes('plateforme') ||
                input.includes('about') || input.includes('propos') || 
                input.includes('qui êtes') || input.includes('c\'est quoi')) {
        this.addBotMessage(this.botResponses.about);
      } else if (input.includes('lieu') || input.includes('ville') ||
                input.includes('où') || input.includes('location') ||
                input.includes('adresse') || input.includes('se trouve')) {
        this.addBotMessage(this.botResponses.location);
      } else if (input.includes('contact') || input.includes('joindre') ||
                input.includes('question') || input.includes('problème') ||
                input.includes('aide')) {
        this.addBotMessage(this.botResponses.contact);
      } else if (input.includes('merci') || input.includes('au revoir') || 
                input.includes('bye') || input.includes('à bientôt')) {
        this.addBotMessage("De rien ! À bientôt et n'hésitez pas à revenir si vous avez d'autres questions.");
      } else if (input.includes('bonjour') || input.includes('salut') || 
                input.includes('hello') || input.includes('bonsoir')) {
        this.addBotMessage("Bonjour ! Comment puis-je vous aider aujourd'hui concernant nos événements ?");
      } else {
        // Try to extract location query
        const locations = this.getUniqueLocations();
        const mentionedLocation = locations.find(location => 
          input.includes(location.toLowerCase())
        );
        
        if (mentionedLocation) {
          this.suggestEventsByLocation(mentionedLocation);
        } else {
          this.addBotMessage(this.botResponses.default);
        }
      }
    }, 800); // Simulate thinking time
  }

  suggestUpcomingEvents(): void {
    if (this.events.length === 0) {
      this.addBotMessage("Je n'ai pas pu trouver d'événements à venir pour le moment. Veuillez réessayer plus tard.");
      return;
    }

    // Sort events by date (assuming eventDate is a proper date format)
    const sortedEvents = [...this.events].sort((a, b) => 
      new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
    
    // Get the next 3 events
    const upcomingEvents = sortedEvents.slice(0, 3);
    
    let message = "Voici les prochains événements à venir :\n\n";
    upcomingEvents.forEach(event => {
      const date = new Date(event.eventDate).toLocaleDateString('fr-FR', {
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });
      
      message += `• ${event.eventTitle} à ${event.eventLocation} le ${date}\n`;
    });
    
    message += "\nPour plus de détails, cliquez sur l'événement qui vous intéresse sur notre page principale.";
    this.addBotMessage(message);
  }

  suggestPopularEvents(): void {
    if (this.events.length === 0) {
      this.addBotMessage("Je n'ai pas pu trouver d'événements populaires pour le moment. Veuillez réessayer plus tard.");
      return;
    }

    // Sort events by participation rate
    const sortedEvents = [...this.events].sort((a, b) => 
      (b.numberParticipants / b.maxParticipants) - (a.numberParticipants / a.maxParticipants)
    );
    
    // Get the top 3 most popular events
    const popularEvents = sortedEvents.slice(0, 3);
    
    let message = "Voici nos événements les plus populaires actuellement :\n\n";
    popularEvents.forEach(event => {
      const participationRate = Math.round((event.numberParticipants / event.maxParticipants) * 100);
      
      message += `• ${event.eventTitle} à ${event.eventLocation} (${participationRate}% complet)\n`;
    });
    
    message += "\nNe tardez pas à vous inscrire, les places partent vite !";
    this.addBotMessage(message);
  }

  suggestEventsByLocation(location: string): void {
    const eventsAtLocation = this.events.filter(event => 
      event.eventLocation.toLowerCase() === location.toLowerCase()
    );
    
    if (eventsAtLocation.length === 0) {
      this.addBotMessage(`Je ne trouve pas d'événements prévus à ${location} pour le moment. Vous pouvez consulter tous nos lieux d'événements avec le filtre en haut de la page.`);
      return;
    }
    
    let message = `Voici les événements prévus à ${location} :\n\n`;
    eventsAtLocation.forEach(event => {
      const date = new Date(event.eventDate).toLocaleDateString('fr-FR', {
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });
      
      message += `• ${event.eventTitle} le ${date}\n`;
    });
    
    message += "\nVous pouvez filtrer par lieu directement depuis la page principale.";
    this.addBotMessage(message);
  }

  getUniqueLocations(): string[] {
    return [...new Set(this.events.map(event => event.eventLocation))];
  }

  addBotMessage(message: string): void {
    this.messages.push({text: message, isBot: true});
    
    // Auto-scroll to bottom after new message
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  }

  navigateToEvent(eventId: number): void {
    this.router.navigate(['event/event-detail', eventId]);
    this.isOpen = false; // Close chat after navigation
  }
}