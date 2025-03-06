import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherMentorshipService } from '../Teacher-Services/teachermentorship.service';
import { MentorshipProgram } from '../../Student-Pages/student-tutoring/student-tutoring.model';
import { PdfExportService } from '../Teacher-Services/pdf-export.service'; // Add this import

@Component({
  selector: 'app-teacher-mentorship',
  templateUrl: './teachermentorship.component.html',
  styleUrls: ['./teachermentorship.component.css']
})
export class TeacherMentorshipComponent implements OnInit {
  mentorshipPrograms: MentorshipProgram[] = [];
  filteredPrograms: MentorshipProgram[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  selectedSubject: string = 'all';
  subjects: string[] = [];
  
  // Instructor info (logged in user)
  currentInstructorId: number = 1; // Ahmed Kaabi
  currentInstructorName: string = 'Ahmed Kaabi';
  
  // CRUD operations
  showProgramModal: boolean = false;
  programForm: FormGroup;
  isEditing: boolean = false;
  currentProgramId: number | null = null;
  
  // Status message
  statusMessage: { type: 'success' | 'error', text: string } | null = null;
  
  // Sort options
  sortByPrice: string = 'none'; // 'none', 'asc', or 'desc'
  
  // Delete confirmation
  showDeleteConfirmation: boolean = false;
  programToDelete: MentorshipProgram | null = null;

  constructor(
    private mentorshipService: TeacherMentorshipService,
    private fb: FormBuilder,
    private pdfService: PdfExportService  // Add this line


  ) {
    this.programForm = this.fb.group({
      programName: ['', [Validators.required]],
      programDescription: ['', [Validators.required, Validators.minLength(20)]],
      programSubject: ['', [Validators.required]],
      programPrice: [0, [Validators.required, Validators.min(0)]],
      programStartDate: ['', [Validators.required]],
      programEndDate: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadMentorshipPrograms();
  }

  loadMentorshipPrograms(): void {
    this.loading = true;
    this.mentorshipService.getMentorshipPrograms().subscribe({
      next: (programs) => {
        // Filter programs for the current instructor (Ahmed Kaabi)
        this.mentorshipPrograms = programs.filter(program => 
          program.instructorId === this.currentInstructorId
        );
        
        this.filteredPrograms = [...this.mentorshipPrograms];
        this.extractSubjects();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading mentorship programs:', err);
        this.error = 'Failed to load your mentorship programs. Please try again later.';
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
      
      return matchesSearch && matchesSubject;
    });
    
    this.sortProgramsByPrice();
  }

  onSearchChange(): void {
    this.filterPrograms();
  }

  onSubjectChange(): void {
    this.filterPrograms();
  }
  
  formatDate(dateString?: string): string {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  }
  
  // CRUD operations
  openCreateModal(): void {
    this.isEditing = false;
    this.currentProgramId = null;
    this.programForm.reset({
      programPrice: 0
    });
    this.showProgramModal = true;
  }
  
  openEditModal(program: MentorshipProgram): void {
    this.isEditing = true;
    this.currentProgramId = program.idMentorshipProgram;
    
    // Format dates for input fields
    const startDate = program.programStartDate ? 
      new Date(program.programStartDate).toISOString().split('T')[0] : '';
    const endDate = program.programEndDate ? 
      new Date(program.programEndDate).toISOString().split('T')[0] : '';
    
    this.programForm.patchValue({
      programName: program.programName,
      programDescription: program.programDescription,
      programSubject: program.programSubject,
      programPrice: program.programPrice,
      programStartDate: startDate,
      programEndDate: endDate
    });
    
    this.showProgramModal = true;
  }
  
  closeModal(): void {
    this.showProgramModal = false;
  }
  
saveProgram(): void {
  console.log('Form submission attempted');
  console.log('Form value:', this.programForm.value);
  console.log('Form valid?', this.programForm.valid);
  console.log('Form errors:', this.getFormValidationErrors());

  if (this.programForm.invalid) {
    // Mark all fields as touched to trigger validation messages
    Object.keys(this.programForm.controls).forEach(key => {
      const control = this.programForm.get(key);
      control?.markAsTouched();
    });
    
    this.showStatusMessage('error', 'Please fix form errors before submitting.');
    return;
  }
  
  const programData: Partial<MentorshipProgram> = {
    ...this.programForm.value,
    instructorId: this.currentInstructorId
  };
  
  // Add loading state
  this.loading = true;
  
  if (this.isEditing && this.currentProgramId) {
    // Update existing program
    console.log('Updating program with ID:', this.currentProgramId);
    this.mentorshipService.updateMentorshipProgram(this.currentProgramId, programData)
      .subscribe({
        next: (updatedProgram) => {
          console.log('Program updated successfully:', updatedProgram);
          // Find and replace the program in the array
          const index = this.mentorshipPrograms.findIndex(p => p.idMentorshipProgram === this.currentProgramId);
          if (index !== -1) {
            this.mentorshipPrograms[index] = updatedProgram;
          }
          
          this.loading = false;
          this.closeModal();
          this.filterPrograms();
          this.showStatusMessage('success', 'Program successfully updated!');
        },
        error: (err) => {
          this.loading = false;
          console.error('Error updating program:', err);
          this.showStatusMessage('error', 'Failed to update program. Please try again.');
        }
      });
  } else {
    // Create new program
    console.log('Creating new program');
    this.mentorshipService.createMentorshipProgram(programData)
      .subscribe({
        next: (newProgram) => {
          console.log('Program created successfully:', newProgram);
          this.mentorshipPrograms.push(newProgram);
          this.loading = false;
          this.closeModal();
          this.filterPrograms();
          this.showStatusMessage('success', 'New program successfully created!');
        },
        error: (err) => {
          this.loading = false;
          console.error('Error creating program:', err);
          this.showStatusMessage('error', 'Failed to create program. Please try again.');
        }
      });
  }
}

getFormValidationErrors(): any {
  const errors: any = {};
  Object.keys(this.programForm.controls).forEach(key => {
    const control = this.programForm.get(key);
    if (control?.errors) {
      errors[key] = control.errors;
    }
  });
  return errors;
}
  
  openDeleteConfirmation(program: MentorshipProgram): void {
    this.programToDelete = program;
    this.showDeleteConfirmation = true;
  }
  
  // Update the confirm delete method
  confirmDelete(): void {
    if (!this.programToDelete) {
      console.error('No program selected for deletion');
      return;
    }
    
    console.log('Confirming deletion of program:', this.programToDelete);
    
    // Add loading state
    this.loading = true;
    
    this.mentorshipService.deleteMentorshipProgram(this.programToDelete.idMentorshipProgram)
      .subscribe({
        next: () => {
          console.log('Program deleted successfully');
          // Remove from the array
          const index = this.mentorshipPrograms.findIndex(p => 
            p.idMentorshipProgram === this.programToDelete?.idMentorshipProgram
          );
          
          if (index !== -1) {
            this.mentorshipPrograms.splice(index, 1);
            this.filterPrograms();
          }
          
          this.loading = false;
          this.showStatusMessage('success', 'Program successfully deleted!');
          this.closeDeleteConfirmation();
        },
        error: (err) => {
          this.loading = false;
          console.error('Error deleting program:', err);
          this.showStatusMessage('error', 'Failed to delete program. Please try again.');
          this.closeDeleteConfirmation();
        }
      });
  }
  
  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation = false;
    this.programToDelete = null;
  }
  
  // Sort functionality
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
  
  onSortChange(): void {
    this.sortProgramsByPrice();
  }
  
  showStatusMessage(type: 'success' | 'error', text: string): void {
    this.statusMessage = { type, text };
    setTimeout(() => {
      this.statusMessage = null;
    }, 5000);
  }
  
  // Form field validation helpers
  get nameControl() { return this.programForm.get('programName'); }
  get descriptionControl() { return this.programForm.get('programDescription'); }
  get subjectControl() { return this.programForm.get('programSubject'); }
  get priceControl() { return this.programForm.get('programPrice'); }
  get startDateControl() { return this.programForm.get('programStartDate'); }
  get endDateControl() { return this.programForm.get('programEndDate'); }


  downloadProgramsAsPDF(): void {
    try {
      if (this.filteredPrograms.length === 0) {
        this.showStatusMessage('error', 'No programs to export! Create some programs first.');
        return;
      }
      
      this.showStatusMessage('success', 'Generating PDF...');
      
      // Call the PDF service to generate and download the PDF
      this.pdfService.generateMentorshipProgramsPDF(
        this.filteredPrograms,
        this.currentInstructorName
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showStatusMessage('error', 'Failed to generate PDF. Please try again.');
    }
  }
  

    // Program status methods
    getProgramStatus(program: MentorshipProgram): string {
      const now = new Date().getTime();
      const startDate = new Date(program.programStartDate || '').getTime();
      const endDate = new Date(program.programEndDate || '').getTime();
      
      if (now < startDate) {
        return 'upcoming';
      } else if (now > endDate) {
        return 'completed';
      } else {
        return 'active';
      }
    }
    
    getProgramStatusIcon(program: MentorshipProgram): string {
      const status = this.getProgramStatus(program);
      
      switch (status) {
        case 'upcoming': return 'fa-clock';
        case 'active': return 'fa-play-circle';
        case 'completed': return 'fa-check-circle';
        default: return 'fa-info-circle';
      }
    }
    
    getProgramStatusText(program: MentorshipProgram): string {
      const status = this.getProgramStatus(program);
      
      switch (status) {
        case 'upcoming': return 'Upcoming';
        case 'active': return 'Active';
        case 'completed': return 'Completed';
        default: return 'Unknown';
      }
    }
    
    getDurationProgress(program: MentorshipProgram): number {
      if (!program.programStartDate || !program.programEndDate) {
        return 0;
      }
      
      const now = new Date().getTime();
      const startDate = new Date(program.programStartDate).getTime();
      const endDate = new Date(program.programEndDate).getTime();
      
      // If hasn't started yet
      if (now < startDate) return 0;
      
      // If already ended
      if (now > endDate) return 100;
      
      // Calculate progress percentage
      const totalDuration = endDate - startDate;
      const elapsed = now - startDate;
      
      return Math.round((elapsed / totalDuration) * 100);
    }
    
    getTotalStudents(): number {
      // This is a placeholder implementation. In a real application, 
      // this would come from actual enrollment data.
      return this.filteredPrograms.length * 5 + Math.floor(Math.random() * 10);
    }
    
    getAveragePrice(): number {
      if (this.filteredPrograms.length === 0) return 0;
      
      const sum = this.filteredPrograms.reduce((total, program) => 
        total + (program.programPrice || 0), 0);
      return sum / this.filteredPrograms.length;
    }

    viewProgramDetails(program: MentorshipProgram): void {
    // In a real app, this might navigate to a detailed view
    // For now, just show information in a message
    this.showStatusMessage('success', `Viewing details for ${program.programName}`);
    
    // You could navigate to a details page:
    // this.router.navigate(['/teacher/mentorship', program.idMentorshipProgram]);
  }



}