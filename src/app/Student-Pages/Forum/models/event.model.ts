export interface Event {
  id: number;
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  eventLocation: string;
  maxParticipants: number;
  numberParticipants: number;
  eventImage?: string; // ✅ Ajoute cette ligne
}
