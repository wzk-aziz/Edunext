import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from 'src/app/Student-Pages/Forum/Event/event.service';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css']
})
export class EventAddComponent implements OnInit {
  eventForm: FormGroup;
  isSubmitting = false;
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    // Set min date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    this.eventForm = this.fb.group({
      eventTitle: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      eventDescription: ['', [Validators.required, Validators.minLength(20)]],
      eventDate: ['', Validators.required],
      eventTime: ['', Validators.required],
      eventLocation: ['', [Validators.required, Validators.minLength(5)]],
      maxParticipants: [50, [Validators.required, Validators.min(5), Validators.max(1000)]]
    });
  }

  ngOnInit(): void {
    // Default to today's date and current time + 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1);
    
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    this.eventForm.patchValue({
      eventDate: dateStr,
      eventTime: timeStr
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.markFormGroupTouched(this.eventForm);
      return;
    }

    this.isSubmitting = true;
    
    // Combine date and time
    const formValues = this.eventForm.value;
    const eventDateTime = new Date(`${formValues.eventDate}T${formValues.eventTime}`);
    
    const eventData = {
      eventTitle: formValues.eventTitle,
      eventDescription: formValues.eventDescription,
      eventDate: eventDateTime.toISOString(),
      eventLocation: formValues.eventLocation,
      maxParticipants: formValues.maxParticipants,
      numberParticipants: 0 // Initialize with zero participants
    };


  }

  // Helper method to mark all controls as touched to trigger validation
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters for form controls to simplify template access
  get titleControl() { return this.eventForm.get('eventTitle'); }
  get descriptionControl() { return this.eventForm.get('eventDescription'); }
  get dateControl() { return this.eventForm.get('eventDate'); }
  get timeControl() { return this.eventForm.get('eventTime'); }
  get locationControl() { return this.eventForm.get('eventLocation'); }
  get maxParticipantsControl() { return this.eventForm.get('maxParticipants'); }

  // Reset form and navigate back to events list
  onCancel(): void {
    this.router.navigate(['/backoffice/events']);
  }
}