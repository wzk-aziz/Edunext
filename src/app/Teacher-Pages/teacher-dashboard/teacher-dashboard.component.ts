// teacher-dashboard.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent {
  // Track which content to show
  activeContent: 'default' | 'virtualClassrooms' | 'mentorshipPrograms' = 'default';
  
  // Method to switch content
  showContent(contentType: 'default' | 'virtualClassrooms' | 'mentorshipPrograms'): void {
    this.activeContent = contentType;
  }
}