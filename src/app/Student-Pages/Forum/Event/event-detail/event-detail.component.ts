import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { ReservationService } from '../reservation.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  // Objet "event" avec les propriétés utilisées dans le HTML
  event: any = {
    id: null,
    eventTitle: 'Event Name',
    eventSubtitle: 'Short Subtitle',
    eventDate: new Date(),
    eventTime: '09:00 - 17:00',
    eventLocation: 'Paris, France',
    eventLocationDetail: 'Salle de conférence, Bâtiment A',
    price: 0,
    numberParticipants: 0,
    maxParticipants: 150,
    description: 'Modern application design has changed quite a bit in recent years. "Mobile-first" and "cloud-ready" are the types of applications you are expected to develop. Also, to keep pace with these demands, Microsoft has revamped their complete web stack with ASP.NET Core to meet these architectural demands.',
    latitude: 48.8566,
    longitude: 2.3522,
    speakers: [],
    schedule: [],
    speakersDescription: 'Learn from industry experts and thought leaders',
    scheduleDescription: 'Detailed agenda for the event',
    duration: '2h',
    eventType: 'Workshop'
  };

  // Pour saisir l’email dans l’input
  studentEmail: string = '';

  // Liste des réservations existantes
  reservations: any[] = [];

  // Variables pour la notification
  reservationMessage: string = '';
  reservationMessageType: 'success' | 'error' | '' = '';

  // Pour la carte Leaflet
  private map: any;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');

    // Initialisation de la carte après un petit délai
    setTimeout(() => {
      this.initMap();
    }, 100);

    if (eventId) {
      this.eventService.getEventById(eventId).subscribe(
        (response: any) => {
          // Fusionner l'objet existant avec les données de l'API
          this.event = {
            ...this.event,
            ...response,
          };

          // Initialiser les speakers si non fournis
          if (!this.event.speakers || !this.event.speakers.length) {
            this.initializeDummySpeakers();
          }

          // Initialiser le schedule si non fourni
          if (!this.event.schedule || !this.event.schedule.length) {
            this.initializeDummySchedule();
          }

          // Ré-initialiser la carte si elle existe déjà
          if (this.map) {
            this.map.remove();
            this.initMap();
          }
        },
        (error: any) => {
          console.error('Failed to load event', error);
          // Utiliser des données factices en cas d'erreur
          this.initializeDummySpeakers();
          this.initializeDummySchedule();
        }
      );

      // Charger la liste des réservations pour cet événement
      this.getReservations(+eventId);
    }
  }

  // Initialisation de la carte Leaflet
  private initMap(): void {
    if (!document.getElementById('event-map')) {
      console.error('Map container not found');
      return;
    }
    this.map = L.map('event-map').setView([this.event.latitude, this.event.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© maps'
    }).addTo(this.map);

    L.marker([this.event.latitude, this.event.longitude])
      .addTo(this.map)
      .bindPopup(this.event.eventTitle || 'Event Location')
      .openPopup();

    // Fix d’affichage
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  // Récupérer les réservations depuis le service
  getReservations(eventId: number): void {
    this.reservationService.getReservationsByEvent(eventId).subscribe(
      (reservations: any[]) => {
        this.reservations = reservations;
        // Mettre à jour le nombre de participants
        if (this.event) {
          this.event.numberParticipants = reservations.length;
        }
      },
      (error: any) => {
        console.error('Failed to load reservations', error);
      }
    );
  }

  // Méthode pour réserver un ticket
  reserveTicket(): void {
    if (!this.studentEmail) {
      this.showReservationMessage('Veuillez saisir votre email.', 'error');
      return;
    }

    this.reservationService.reserveTicket(this.event.id, this.studentEmail)
      .subscribe(
        (response: any) => {
          this.showReservationMessage('Réservation ajoutée avec succès !', 'success');
          this.getReservations(this.event.id);
        },
        (error: any) => {
          console.error('Reservation failed:', error);
          this.showReservationMessage('Échec de la réservation.', 'error');
        }
      );
  }

  // Afficher/cacher la description d’une journée dans le planning
  toggleScheduleDay(day: any): void {
    day.isExpanded = !day.isExpanded;
  }

  // Notification personnalisée (sans Snackbar)
  private showReservationMessage(message: string, type: 'success' | 'error'): void {
    this.reservationMessage = message;
    this.reservationMessageType = type;

    // Effacer la notification après 3 secondes
    setTimeout(() => {
      this.reservationMessage = '';
      this.reservationMessageType = '';
    }, 3000);
  }

  // Données fictives de speakers
  private initializeDummySpeakers(): void {
    this.event.speakers = [
      {
        name: 'Bil Gates',
        avatarUrl: 'assets/speaker1.jpg',
        followers: '2.5M followers',
        role: 'Entrepreneur américain'
      },
      {
        name: 'mark zuckerberg',
        avatarUrl: 'assets/speaker2.jpg',
        followers: '40K followers',
        role: 'Head Engineer'
      }
    ];
  }

  // Données fictives de schedule
  private initializeDummySchedule(): void {
    this.event.schedule = [
      {
        name: 'Day-1 (Wed, January 1)',
        isExpanded: true,
        sessions: [
          {
            title: 'Grad Opening',
            time: '8:00 am',
            type: 'session',
            speaker: {
              name: 'Lori Stevens',
              role: 'Chairman of Eduport',
              avatarUrl: 'assets/speake3.jpg'
            }
          },
          {
            title: 'The Modern Engineering Methods',
            time: '9:00 am',
            type: 'session',
            speaker: {
              name: 'Billy Vasquez',
              role: 'Partner Startup',
              avatarUrl: 'assets/speaker4.jpg'
            }
          },
          {
            title: 'Coffee Break',
            time: '10:00 am',
            type: 'break'
          },
          {
            title: 'Evolution of User Experience',
            time: '10:30 am',
            type: 'session',
            speaker: {
              name: 'Larry Lawson & Carolyn Ortiz',
              role: 'Co-founder and Eduport Director',
              avatarUrl: 'assets/speaker5.jpeg'
            }
          },
          {
            title: 'Responsive Web Applications',
            time: '2:00 pm',
            type: 'session',
            speaker: {
              name: 'Jacqueline Miller',
              role: 'Head Engineer',
              avatarUrl: 'assets/speaker2.jpg'
            }
          }
        ]
      },
      {
        name: 'Day-2 (Thu, January 2)',
        isExpanded: false,
        sessions: [
          {
            title: 'Advanced Techniques',
            time: '9:00 am',
            type: 'session',
            speaker: {
              name: 'Dennis Barrett',
              role: 'Senior Developer',
              avatarUrl: 'assets/speaker1.jpg'
            }
          },
          {
            title: 'Lunch Break',
            time: '12:00 pm',
            type: 'break'
          }
        ]
      }
    ];
  }
}
