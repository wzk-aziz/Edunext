import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../../models/event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  uniqueLocations: string[] = [];
  searchTerm: string = '';
  locationFilter: string = '';

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(data => {
      this.events = data;
      this.filteredEvents = [...this.events];
      this.extractUniqueLocations();
    });
  }

  extractUniqueLocations(): void {
    this.uniqueLocations = [...new Set(this.events.map(event => event.eventLocation))];
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      // Filter by search term
      const matchesSearch = this.searchTerm === '' || 
        event.eventTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.eventDescription.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filter by location
      const matchesLocation = this.locationFilter === '' || 
        event.eventLocation === this.locationFilter;
      
      return matchesSearch && matchesLocation;
    });
  }

  isAlmostFull(event: Event): boolean {
    // Return true if the event is at least 80% full
    return (event.numberParticipants / event.maxParticipants) >= 0.8;
  }

  goToEventDetail(eventId: number): void {
    this.router.navigate(['event/event-detail', eventId]);
  }
}