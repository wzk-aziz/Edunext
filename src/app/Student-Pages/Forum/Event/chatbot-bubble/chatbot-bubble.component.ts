import { Component } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../../models/event.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chatbot-bubble',
  templateUrl: './chatbot-bubble.component.html',
  styleUrls: ['./chatbot-bubble.component.css']
})
export class ChatbotBubbleComponent {
  isOpen = false;
  messages: {text: string, isBot: boolean}[] = [];
  userInput = '';
  events: Event[] = [];
  isTyping = false;
// Ajout à la classe ChatbotBubbleComponent
// Nouvelles propriétés
  botName = 'EventBot';
  botAvatar = 'assets/images/bot-avatar.png'; // Créez cette image
  userAvatar = 'assets/images/user-avatar.png'; // Optionnel
  showTimestamp = true;
  animateMessages = true;
  suggestionCategories = ['Général', 'Événements', 'Aide'];
  currentSuggestionCategory = 'Général';

// Suggestions étendues organisées par catégorie
  extendedSuggestions = {
    'Général': [
      { text: 'Présentation', query: 'Pouvez-vous vous présenter?' },
      { text: 'À propos du site', query: 'Parlez-moi de cette plateforme' },
      { text: 'Contact', query: 'Comment vous contacter?' }
    ],
    'Événements': [
      { text: 'Prochains événements', query: 'Quels sont les prochains événements?' },
      { text: 'Événements populaires', query: 'Événements les plus populaires?' },
      { text: 'Hackathons', query: 'Informations sur les hackathons' }
    ],
    'Aide': [
      { text: 'S\'inscrire', query: 'Comment s\'inscrire?' },
      { text: 'Filtrer par ville', query: 'Comment filtrer par ville?' },
      { text: 'Annuler participation', query: 'Comment annuler ma participation?' }
    ]
  };
  // Predefined responses about events and site
  botResponses = {
    welcome: "Bonjour ! Je suis EventBot, votre assistant virtuel. Je peux vous aider avec les événements, inscriptions et informations sur notre plateforme. Que puis-je faire pour vous aujourd'hui ?",
    events: "Nous organisons régulièrement des hackathons, ateliers tech, et conférences pour la communauté. Voici quelques événements à venir:\n\n• Hackathon IA pour débutants\n• Workshop Design Thinking\n• Conférence Cybersécurité\n\nSouhaitez-vous des détails sur l'un d'entre eux ?",
    registration: "L'inscription est simple !\n\n1. Cliquez sur 'View Details' pour l'événement qui vous intéresse\n2. Cliquez sur le bouton d'inscription\n3. Remplissez le formulaire\n4. Validez par email\n\nBesoin d'aide supplémentaire ?",
    about: "Notre plateforme connecte les passionnés de technologie et d'innovation. Créée en 2020, nous avons déjà organisé plus de 150 événements avec 12,000+ participants. Notre mission: faciliter les rencontres et le partage de connaissances dans un cadre convivial et professionnel.",
    location: "Nos événements se déroulent dans plusieurs villes comme Paris, Lyon, Bordeaux, Lille et Marseille. Pour les événements dans votre ville, utilisez le filtre de localisation en haut de la page principale. Nous proposons aussi des événements en ligne accessibles partout !",
    contact: "Plusieurs options pour nous contacter :\n\n• Email: support@eventhub.com\n• Téléphone: 01 23 45 67 89\n• Formulaire: en bas de la page d'accueil\n• Réseaux sociaux: @EventHub sur Twitter et Instagram\n\nNotre équipe répond sous 24h ouvrées.",
    faq: "Voici les questions fréquentes :\n\n• Les événements sont-ils gratuits ? La plupart sont gratuits, certains premium sont payants\n• Faut-il s'inscrire en avance ? Oui, les places sont limitées\n• Puis-je annuler ? Oui, jusqu'à 48h avant l'événement\n\nD'autres questions ?",
    hackathons: "Nos hackathons sont des compétitions d'innovation intensives de 24 à 48h. Vous formez des équipes pour résoudre des défis réels posés par nos partenaires. Ils sont ouverts aux développeurs, designers et chefs de projet. Les meilleures équipes remportent des prix et opportunités professionnelles !",
    partners: "Nous collaborons avec de nombreuses entreprises tech et institutions comme Microsoft, Google, Orange, BNF, et plusieurs universités françaises. Nos partenaires proposent des défis, mentoring et sponsorisent les événements.",
    speakers: "Nos conférenciers sont des experts reconnus dans leurs domaines : CTO, chercheurs, entrepreneurs à succès, et professionnels expérimentés. Nous sélectionnons des intervenants passionnés capables de transmettre leur savoir de façon engageante.",
    preparation: "Pour bien préparer votre participation :\n\n1. Lisez la description complète de l'événement\n2. Vérifiez les prérequis techniques si nécessaire\n3. Rejoignez notre Discord pour rencontrer d'autres participants\n4. Préparez vos questions pour les intervenants\n\nBesoin d'autres conseils ?",
    benefits: "Participer à nos événements vous permet de :\n\n• Développer vos compétences techniques\n• Élargir votre réseau professionnel\n• Découvrir les dernières tendances\n• Rencontrer des recruteurs potentiels\n• Obtenir des certifications (pour certains ateliers)\n\nC'est un excellent moyen d'accélérer votre carrière !",
    default: "Je n'ai pas bien saisi votre demande. Pouvez-vous reformuler ou choisir parmi les suggestions ci-dessous ? Je suis là pour vous aider avec tout ce qui concerne nos événements et notre plateforme."
  };

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    // Charger les événements pour pouvoir les suggérer
    this.eventService.getEvents().subscribe(data => {
      this.events = data;
    });
  }

// Nouvelles méthodes
  changeSuggestionCategory(category: string): void {
    this.currentSuggestionCategory = category;
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
      // Analyse sémantique étendue
      if (input.includes('prochain') || input.includes('bientôt') || input.includes('à venir')) {
        this.suggestUpcomingEvents();
      } else if (input.includes('populaire') || input.includes('recommand') || input.includes('tendance')) {
        this.suggestPopularEvents();
      } else if (input.includes('hackathon') || input.includes('compétition') || input.includes('concours')) {
        this.addBotMessage(this.botResponses.hackathons);
      } else if (input.includes('partenaire') || input.includes('sponsor') || input.includes('entreprise')) {
        this.addBotMessage(this.botResponses.partners);
      } else if (input.includes('conférencier') || input.includes('intervenant') || input.includes('speaker')) {
        this.addBotMessage(this.botResponses.speakers);
      } else if (input.includes('prépar') || input.includes('conseil') || input.includes('avant de')) {
        this.addBotMessage(this.botResponses.preparation);
      } else if (input.includes('avantage') || input.includes('bénéfice') || input.includes('pourquoi particip')) {
        this.addBotMessage(this.botResponses.benefits);
      } else if (input.includes('faq') || input.includes('question') || input.includes('fréquent')) {
        this.addBotMessage(this.botResponses.faq);
      } else if (input.includes('événement') || input.includes('evenement') || input.includes('event')) {
        this.addBotMessage(this.botResponses.events);
      } else if (input.includes('inscri') || input.includes('particip') || input.includes('rejoin')) {
        this.addBotMessage(this.botResponses.registration);
      }
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
        // Recherche de mots-clés généraux
        const keywords = {
          'présentation': this.botResponses.welcome,
          'bonjour': "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
          'merci': "De rien ! Je suis ravi d'avoir pu vous aider. N'hésitez pas si vous avez d'autres questions.",
          'au revoir': "Au revoir ! J'espère vous revoir bientôt sur notre plateforme.",
          'aide': "Je suis là pour vous aider ! Vous pouvez me poser des questions sur nos événements, l'inscription, nos partenaires, ou notre plateforme en général."
        };

        // Vérifier si un mot-clé est présent
        let foundKeyword = false;
        for (const [keyword, response] of Object.entries(keywords)) {
          if (input.includes(keyword)) {
            this.addBotMessage(response);
            foundKeyword = true;
            break;
          }
        }

        if (!foundKeyword) {
          this.addBotMessage(this.botResponses.default);
        }
      }
    }, 800);
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
    // Ajouter timestamp si activé
    const timestamp = this.showTimestamp ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';

    this.messages.push({
      text: message,
      isBot: true,
    });

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
