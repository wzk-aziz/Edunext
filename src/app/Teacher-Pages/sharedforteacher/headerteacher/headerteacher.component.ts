import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headerteacher',
  templateUrl: './headerteacher.component.html',
  styleUrls: ['./headerteacher.component.css']
})
export class HeaderteacherComponent {
  
  constructor(private router: Router) { }
  
  onVirtualClassroomsClick(event: Event): void {
    event.preventDefault();
    console.log('Virtual Classrooms clicked');
    this.router.navigate(['/teacher/virtual-classrooms']);
  }
  
  onMentorshipProgramsClick(event: Event): void {
    event.preventDefault();
    console.log('Mentorship Programs clicked');
    this.router.navigate(['/teacher/mentorship-programs']); // Create this component later
  }
}