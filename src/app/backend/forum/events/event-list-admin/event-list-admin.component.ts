import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Student-Pages/Forum/Event/event.service';
import { Event } from 'src/app/Student-Pages/Forum/models/event.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-event-list-admin',
  templateUrl: './event-list-admin.component.html',
  styleUrls: ['./event-list-admin.component.css']
})
export class EventListAdminComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchControl = new FormControl('');
  locationFilter = new FormControl('');
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  
  // Loading state
  isLoading = true;
  
  constructor(private eventService: EventService, private router: Router) {}
  
  ngOnInit(): void {
    this.loadAllEvents();
    
    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filterEvents();
      });
    
    this.locationFilter.valueChanges.subscribe(() => {
      this.filterEvents();
    });
  }
  
  loadAllEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = [...this.events];
        this.totalItems = this.filteredEvents.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements:', err);
        this.isLoading = false;
      }
    });
  }
  
  goToAddEvent(): void {
    this.router.navigate(['/backoffice/events/add']);
  }
  
  editEvent(eventId: string): void {
    this.router.navigate([`/backoffice/events/update/${eventId}`]);
  }
  

  filterEvents(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const locationTerm = this.locationFilter.value?.toLowerCase() || '';
    
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = event.eventTitle.toLowerCase().includes(searchTerm);
      const matchesLocation = !locationTerm || event.eventLocation.toLowerCase().includes(locationTerm);
      
      return matchesSearch && matchesLocation;
    });
    
    this.totalItems = this.filteredEvents.length;
    this.currentPage = 1; // Reset to first page when filtering
  }
  
  changePage(page: number): void {
    this.currentPage = page;
  }
  
  get paginatedEvents(): Event[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEvents.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  
  refreshEvents(): void {
    this.loadAllEvents();
  }
}