import { Component, OnInit } from '@angular/core';
import { MentorshipService } from 'src/app/Student-Pages/Student-Services/mentorship.service';
import { MentorshipProgram } from 'src/app/Student-Pages/student-tutoring/student-tutoring.model';

import emailjs from '@emailjs/browser';



@Component({
  selector: 'app-student-tutoring',
  templateUrl: './student-tutoring.component.html',
  styleUrls: ['./student-tutoring.component.css']
})
export class StudentTutoringComponent implements OnInit {
  mentorshipPrograms: MentorshipProgram[] = [];
  filteredPrograms: MentorshipProgram[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  selectedSubject: string = 'all';
  subjects: string[] = [];


    // Add this instructor mapping directly in the component
    private instructors = [
      { id: 1, name: 'Ahmed Kaabi' },
      { id: 2, name: 'Arthur Morgan' },
      { id: 3, name: 'Dutch Van Der Lin' }
    ];

    // Add these properties to your component
selectedPriceRange: string = 'all';
selectedInstructor: number = 0; // 0 means all instructors
selectedDateRange: string = 'all';
instructorsList: {id: number, name: string}[] = [];

// Define price range options
priceRanges = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $100', value: '0-100' },
  { label: '$100 - $200', value: '100-200' },
  { label: '$200 - $300', value: '200-300' },
  { label: 'Over $300', value: '300+' }
];

// Define date range options
dateRanges = [
  { label: 'All Dates', value: 'all' },
  { label: 'Starting This Month', value: 'this-month' },
  { label: 'Starting Next Month', value: 'next-month' },
  { label: 'Future Programs', value: 'future' }
];

//TRI PRICE 
sortByPrice: string = 'none'; // 'none', 'asc', or 'desc'

// Email
showEnrollmentModal: boolean = false;
selectedProgram: MentorshipProgram | null = null;
enrollmentEmail: string = '';
sendingEnrollment: boolean = false;
enrollmentStatus: { success: boolean; message: string } | null = null;


  constructor(private mentorshipService: MentorshipService) { }

  ngOnInit(): void {
    this.loadMentorshipPrograms();
    emailjs.init("mp4opsuYaJa1NMSqU");

  }

   // Update these methods to use camelCase properties
  loadMentorshipPrograms(): void {
    this.loading = true;
    this.mentorshipService.getMentorshipPrograms().subscribe({
      next: (programs) => {
        console.log('Original programs from API:', programs);
        
        this.mentorshipPrograms = programs.map(program => ({
          ...program,
          instructor_name: this.getInstructorName(program.instructorId)
        }));
  
        this.filteredPrograms = [...this.mentorshipPrograms];
        this.extractSubjects();
        this.extractInstructors(); // Add this line

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading mentorship programs:', err);
        this.error = 'Failed to load mentorship programs. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  extractSubjects(): void {
    const subjectSet = new Set<string>();
    this.mentorshipPrograms.forEach(program => {
      if (program.programSubject) {
        subjectSet.add(program.programSubject);
      }
    });
    this.subjects = Array.from(subjectSet);
  }
  
  filterPrograms(): void {
    this.filteredPrograms = this.mentorshipPrograms.filter(program => {
      // Text search filter
      const matchesSearch = program.programName.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                        program.programDescription.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Subject filter
      const matchesSubject = this.selectedSubject === 'all' || program.programSubject === this.selectedSubject;
      
      // Instructor filter
      const matchesInstructor = this.selectedInstructor === 0 || program.instructorId === this.selectedInstructor;
      
      // Price filter
      let matchesPrice = true;
      if (this.selectedPriceRange !== 'all') {
        const price = program.programPrice;
        const [min, max] = this.selectedPriceRange.split('-');
        
        if (max) {
          // Range like "100-200"
          matchesPrice = price >= parseFloat(min) && price <= parseFloat(max);
        } else if (min.endsWith('+')) {
          // Range like "300+"
          matchesPrice = price >= parseFloat(min.slice(0, -1));
        } else {
          // Single value
          matchesPrice = price <= parseFloat(min);
        }
      }
      
      // Date filter
      let matchesDate = true;
      if (this.selectedDateRange !== 'all') {
        const startDate = new Date(program.programStartDate);
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        const nextMonthDate = new Date(today);
        nextMonthDate.setMonth(currentMonth + 1);
        
        switch (this.selectedDateRange) {
          case 'this-month':
            matchesDate = startDate.getMonth() === currentMonth && 
                          startDate.getFullYear() === currentYear;
            break;
          case 'next-month':
            matchesDate = startDate.getMonth() === nextMonthDate.getMonth() && 
                          startDate.getFullYear() === nextMonthDate.getFullYear();
            break;
          case 'future':
            matchesDate = startDate > today;
            break;
        }
      }
      
      return matchesSearch && matchesSubject && matchesInstructor && matchesPrice && matchesDate;
    });
    this.sortProgramsByPrice();

  }

  onSearchChange(): void {
    this.filterPrograms();
  }

  onSubjectChange(subject: string): void {
    this.selectedSubject = subject;
    this.filterPrograms();
  }
// In student-tutoring.component.ts
formatDate(dateString?: string): string {
  if (!dateString) {
    return 'Not specified';  // Or any default value you prefer
  }
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });
}

    // Helper method to get instructor name
    getInstructorName(id: number): string {
      const instructor = this.instructors.find(i => i.id === id);
      return instructor ? instructor.name : `Instructor #${id}`;
    }

    // Add these methods
extractInstructors(): void {
  const instructorSet = new Set<number>();
  this.mentorshipPrograms.forEach(program => {
    if (program.instructorId) {
      instructorSet.add(program.instructorId);
    }
  });
  
  this.instructorsList = Array.from(instructorSet).map(id => ({
    id: id,
    name: this.getInstructorName(id)
  }));
}

onPriceRangeChange(): void {
  this.filterPrograms();
}

onInstructorChange(): void {
  // Convert selectedInstructor to a number to ensure proper comparison
  this.selectedInstructor = +this.selectedInstructor;
  console.log('Selected instructor ID:', this.selectedInstructor, 'type:', typeof this.selectedInstructor);
  this.filterPrograms();
}

onDateRangeChange(): void {
  this.filterPrograms();
}

// Add this new method for price sorting
sortProgramsByPrice(): void {
  if (this.sortByPrice === 'none') {
    // Do nothing, keep original order
    return;
  }
  
  this.filteredPrograms.sort((a, b) => {
    if (this.sortByPrice === 'asc') {
      return a.programPrice - b.programPrice;
    } else {
      return b.programPrice - a.programPrice;
    }
  });
}

// Add new method to handle sort changes
onSortChange(): void {
  this.sortProgramsByPrice();
}

// Add these methods
openEnrollmentModal(program: MentorshipProgram): void {
  this.selectedProgram = program;
  this.showEnrollmentModal = true;
  this.enrollmentEmail = '';
  this.enrollmentStatus = null;
}

closeEnrollmentModal(): void {
  this.showEnrollmentModal = false;
  this.selectedProgram = null;
  this.enrollmentEmail = '';
  this.enrollmentStatus = null;
}

isValidEmail(email: string): boolean {
  if (!email) return true; // Don't show error for empty field initially
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

sendEnrollmentEmail(): void {
  if (!this.enrollmentEmail || !this.isValidEmail(this.enrollmentEmail) || !this.selectedProgram) {
    this.enrollmentStatus = {
      success: false,
      message: 'Please enter a valid email address'
    };
    return;
  }
  
  this.sendingEnrollment = true;
  this.enrollmentStatus = null;
  
  // EmailJS template parameters
  const templateParams = {
    to_email: this.enrollmentEmail,
    program_name: this.selectedProgram.programName,
    instructor_name: this.selectedProgram.instructor_name,
    start_date: this.formatDate(this.selectedProgram.programStartDate),
    end_date: this.formatDate(this.selectedProgram.programEndDate),
    program_price: this.selectedProgram.programPrice.toFixed(2),
    subject: this.selectedProgram.programSubject,
  };

  // Send email using EmailJS
  emailjs.send(
    'service_3h2lycg',       // Use your existing service ID
    'template_ifqwrsm',      // Use your existing template or create a new one
    templateParams,
    'mp4opsuYaJa1NMSqU'      // Your EmailJS public key
  )
  .then((response) => {
    console.log('Enrollment confirmation sent successfully!', response);
    this.sendingEnrollment = false;
    this.enrollmentStatus = {
      success: true,
      message: 'Enrollment successful! Check your email for confirmation details.'
    };
    
    // Close modal after success with a delay
    setTimeout(() => {
      this.closeEnrollmentModal();
    }, 3000);
  })
  .catch((error) => {
    console.error('Error sending enrollment email:', error);
    this.sendingEnrollment = false;
    this.enrollmentStatus = {
      success: false,
      message: 'Failed to complete enrollment. Please try again.'
    };
  });
}









}