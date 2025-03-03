// At the top of the file with other imports
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';//import { MatPaginator } from '@angular/material/paginator';
import { MentorshipProgramService } from '../Tutoring-Services/mentorship-program.service';
import { MentorshipProgram } from './mentorship-program.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-mentorship-porgram',
  templateUrl: './mentorship-porgram.component.html',
  styleUrls: ['./mentorship-porgram.component.css']
})
export class MentorshipPorgramComponent implements OnInit {
  displayedColumns: string[] = [
    'idMentorshipProgram', 
    'ProgramName', 
    'ProgramDescription', 
    'ProgramPrice', 
    'ProgramStartDate', 
    'ProgramEndDate', 
    'ProgramSubject', 
    'instructor_id', 
    'actions'
  ];
  mentorshipPrograms: MentorshipProgram[] = [];
  filteredMentorshipPrograms: MentorshipProgram[] = [];
  paginatedPrograms: MentorshipProgram[] = []; // For pagination
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  Math = Math; // For template access
  
  // For filtering
  filters: {
    subject: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    dateFrom: Date | null;
    dateTo: Date | null;
  } = {
    subject: null,
    minPrice: null,
    maxPrice: null,
    dateFrom: null,
    dateTo: null
  };
  availableSubjects: string[] = [];
  
  newMentorshipProgram: MentorshipProgram = {
    idMentorshipProgram: 0,
    ProgramDescription: '',
    ProgramEndDate: new Date(),
    ProgramName: '',
    ProgramPrice: 0,
    ProgramStartDate: new Date(),
    ProgramSubject: '',
    instructor_id: 0
  };
  
  selectedMentorshipProgram: MentorshipProgram | null = null;
  showCreateForm = false;
  searchTerm: string = '';
  loading = false;
  error: string | null = null;
  debugData: any = null; // For debugging responses

    // Add these properties to the component class
  formSubmitted = false;
  @ViewChild('confettiCanvas') confettiCanvas: ElementRef | undefined;
  @ViewChild('mentorshipProgramForm') mentorshipProgramForm!: NgForm;
  @ViewChild('editMentorshipProgramForm') editMentorshipProgramForm!: NgForm;

  toasts: Array<{message: string, type: 'success' | 'error' | 'info' | 'warning'}> = [];

    // Place after the existing @ViewChild declarations 

  constructor(private mentorshipProgramService: MentorshipProgramService) {}

  ngOnInit(): void {
    this.fetchMentorshipPrograms();
  }

  // Update filterMentorshipPrograms to use advanced filtering
  filterMentorshipPrograms() {
    // Reset filter if no search term
    if (!this.searchTerm) {
      this.filteredMentorshipPrograms = this.applyFilters([...this.mentorshipPrograms]);
    } else {
      const search = this.searchTerm.toLowerCase();
      const filtered = this.mentorshipPrograms.filter(program => 
        program.ProgramName.toLowerCase().includes(search) ||
        program.ProgramDescription.toLowerCase().includes(search) ||
        program.ProgramSubject.toLowerCase().includes(search)
      );
      
      // Apply any active filters after search
      this.filteredMentorshipPrograms = this.applyFilters(filtered);
    }
    
    this.currentPage = 1; // Reset to first page when searching
    this.paginate(); // Apply pagination
  }

  // Apply additional filters
  applyFilters(programs: MentorshipProgram[]): MentorshipProgram[] {
    let result = [...programs];
    
    // Filter by subject
    if (this.filters.subject) {
      result = result.filter(program => 
        program.ProgramSubject === this.filters.subject
      );
    }
    
    // Filter by price range
    if (this.filters.minPrice !== null) {
      result = result.filter(program => 
        program.ProgramPrice >= this.filters.minPrice!
      );
    }
    
    if (this.filters.maxPrice !== null) {
      result = result.filter(program => 
        program.ProgramPrice <= this.filters.maxPrice!
      );
    }
    
    // Filter by date range
    if (this.filters.dateFrom) {
      const fromDate = new Date(this.filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter(program => {
        const programStartDate = program.ProgramStartDate instanceof Date ? 
          program.ProgramStartDate : new Date(program.ProgramStartDate);
        return programStartDate >= fromDate;
      });
    }
    
    if (this.filters.dateTo) {
      const toDate = new Date(this.filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(program => {
        const programStartDate = program.ProgramStartDate instanceof Date ? 
          program.ProgramStartDate : new Date(program.ProgramStartDate);
        return programStartDate <= toDate;
      });
    }
    
    return result;
  }

  // Extract available filters from data
  extractFilters() {
    // Extract unique subjects
    this.availableSubjects = Array.from(new Set(
      this.mentorshipPrograms
        .map(program => program.ProgramSubject)
        .filter(Boolean) as string[]
    ));
  }

  clearFilters() {
    this.filters = {
      subject: null,
      minPrice: null,
      maxPrice: null,
      dateFrom: null,
      dateTo: null
    };
    this.searchTerm = '';
    this.filteredMentorshipPrograms = [...this.mentorshipPrograms];
    this.currentPage = 1;
    this.paginate();
  }

  // Add pagination methods
  paginate() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPrograms = this.filteredMentorshipPrograms.slice(startIndex, endIndex);
  }

  nextPage() {
    const totalPages = Math.ceil(this.filteredMentorshipPrograms.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.paginate();
  }

  // Replace these methods with much simpler ones that call your helper
  createMentorshipProgram(): void {
    // Set formSubmitted to true immediately to show validation errors
    this.formSubmitted = true;
    
    // Force angular to run change detection before continuing
    setTimeout(() => {
      // Get form reference 
      if (this.mentorshipProgramForm && this.mentorshipProgramForm.invalid) {
        this.showToast('Please fill in all required fields correctly', 'warning');
        return;
      }
      
      // Proceed with form submission only if valid
      this.createOrUpdateMentorshipProgram(false);
    }, 0);
  }
  
  updateMentorshipProgram(): void {
    // Set formSubmitted to true immediately to show validation errors
    this.formSubmitted = true;
    
    // Force angular to run change detection before continuing
    setTimeout(() => {
      // Get form reference
      if (this.editMentorshipProgramForm && this.editMentorshipProgramForm.invalid) {
        this.showToast('Please fill in all required fields correctly', 'warning');
        return;
      }
      
      // Proceed with form submission only if valid
      this.createOrUpdateMentorshipProgram(true);
    }, 0);
  }


 resetForm() {
    this.newMentorshipProgram = {
      idMentorshipProgram: 0,
      ProgramDescription: '',
      ProgramEndDate: new Date(),
      ProgramName: '',
      ProgramPrice: 0,
      ProgramStartDate: new Date(),
      ProgramSubject: '',
      instructor_id: 0
    };
    this.formSubmitted = false;
    this.showCreateForm = false;
  }

  deleteMentorshipProgram(id: number): void {
    if (!confirm('Are you sure you want to delete this mentorship program?')) {
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.mentorshipProgramService.deleteMentorshipProgram(id).subscribe({
      next: () => {
        this.mentorshipPrograms = this.mentorshipPrograms.filter(
          program => program.idMentorshipProgram !== id
        );
        this.filteredMentorshipPrograms = [...this.mentorshipPrograms];
        this.paginate();
        this.loading = false;
        alert('Mentorship Program deleted successfully!');
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.error = `Deletion failed: ${err.message}`;
        this.loading = false;
      }
    });
  }

  selectMentorshipProgram(program: MentorshipProgram): void {
    // Create a deep copy to avoid modifying the original in the list
    this.selectedMentorshipProgram = JSON.parse(JSON.stringify(program));
    
    // Ensure dates are Date objects for the form inputs
    if (this.selectedMentorshipProgram) {
      if (this.selectedMentorshipProgram.ProgramStartDate) {
        this.selectedMentorshipProgram.ProgramStartDate = new Date(this.selectedMentorshipProgram.ProgramStartDate);
      }
      
      if (this.selectedMentorshipProgram.ProgramEndDate) {
        this.selectedMentorshipProgram.ProgramEndDate = new Date(this.selectedMentorshipProgram.ProgramEndDate);
      }
    }
  }

  clearSelection(): void {
    this.selectedMentorshipProgram = null;
    this.formSubmitted = false; // ADD THIS LINE
  }

  // Replace your current formatDateForInput method with this:
  formatDateForInput(date: Date | string): string {
    if (!date) return '';
    
    let dateObj: Date;
    if (date instanceof Date) {
      dateObj = date;
    } else {
      try {
        dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          console.warn('Invalid date in formatDateForInput:', date);
          return '';
        }
      } catch (e) {
        console.error('Error parsing date in formatDateForInput:', e);
        return '';
      }
    }
    
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  // Parse input date
  parseInputDate(dateString: string): Date {
    return new Date(dateString);
  }
  
  debugFetchPrograms() {
    this.loading = true;
    this.error = null;
    
    console.log('Testing API connection...');
    
    fetch('http://localhost:8087/mentorship-programs/all')
      .then(response => {
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return response.text(); // Get as text first to examine
      })
      .then(text => {
        console.log('Raw API response first 200 chars:', text.substring(0, 200) + '...');
        
        // Now parse it
        try {
          const data = JSON.parse(text);
          console.log('API test successful, parsed data:', data);
          
          // Examine the first item to see what fields we have
          if (Array.isArray(data) && data.length > 0) {
            console.log('First program fields:', Object.keys(data[0]));
            console.log('First program data:', data[0]);
            
            // Detailed field inspection to diagnose which fields are missing
            const firstProgram = data[0];
            console.log('DETAILED FIELD INSPECTION:');
            console.log('Raw JSON keys:', Object.keys(firstProgram));
              
            // Check each expected field individually with type information
            console.log('ID:', firstProgram.idMentorshipProgram, typeof firstProgram.idMentorshipProgram);
            console.log('Name:', firstProgram.ProgramName, typeof firstProgram.ProgramName);
            console.log('Description:', firstProgram.ProgramDescription, typeof firstProgram.ProgramDescription);
            console.log('Subject:', firstProgram.ProgramSubject, typeof firstProgram.ProgramSubject);
            console.log('Price:', firstProgram.ProgramPrice, typeof firstProgram.ProgramPrice);
            console.log('Start date:', firstProgram.ProgramStartDate, typeof firstProgram.ProgramStartDate);
            console.log('End date:', firstProgram.ProgramEndDate, typeof firstProgram.ProgramEndDate);
            
            // Check if the field names might be lowercase instead
            console.log('Alternative field names check:');
            console.log('programName:', firstProgram.programName);
            console.log('programDescription:', firstProgram.programDescription); 
            console.log('programSubject:', firstProgram.programSubject);
            
            // Check instructor object
            if (firstProgram.instructor) {
              console.log('Instructor object:', firstProgram.instructor);
            }
            
            // Fixed mapping that handles both uppercase and lowercase field names
            const mappedData = data.map(program => {
              console.log('Processing program:', program.idMentorshipProgram);
              
              // Handle instructor relationship specifically
              let instructorId = null;
              if (program.instructor && typeof program.instructor === 'object') {
                instructorId = program.instructor.idInstructor;
                console.log(`Found instructor ID: ${instructorId} for program ${program.idMentorshipProgram}`);
              } else if (program.instructor_id) {
                instructorId = program.instructor_id;
              }
              
              // Try both uppercase and lowercase field names
              const name = program.ProgramName || program.programName || '';
              const description = program.ProgramDescription || program.programDescription || '';
              const subject = program.ProgramSubject || program.programSubject || '';
              
              // Parse price as number
              let price = 0;
              if (typeof program.ProgramPrice === 'number') {
                price = program.ProgramPrice;
              } else if (typeof program.programPrice === 'number') {
                price = program.programPrice;
              } else if (program.ProgramPrice) {
                price = parseFloat(program.ProgramPrice) || 0;
              } else if (program.programPrice) {
                price = parseFloat(program.programPrice) || 0;
              }
              
              // Process start date with validation
              let startDate;
              try {
                const startDateValue = program.ProgramStartDate || program.programStartDate;
                if (startDateValue) {
                  startDate = new Date(startDateValue);
                  if (isNaN(startDate.getTime())) {
                    console.warn('Invalid start date, using current date:', startDateValue);
                    startDate = new Date();
                  }
                } else {
                  startDate = new Date();
                }
              } catch (e) {
                console.error('Error parsing start date:', e);
                startDate = new Date();
              }
              
              // Process end date with validation
              let endDate;
              try {
                const endDateValue = program.ProgramEndDate || program.programEndDate;
                if (endDateValue) {
                  endDate = new Date(endDateValue);
                  if (isNaN(endDate.getTime())) {
                    console.warn('Invalid end date, using current date:', endDateValue);
                    endDate = new Date();
                  }
                } else {
                  endDate = new Date();
                }
              } catch (e) {
                console.error('Error parsing end date:', e);
                endDate = new Date();
              }
              
              // Create mapped object with all fields properly populated
              const mappedProgram = {
                idMentorshipProgram: program.idMentorshipProgram,
                ProgramName: name,
                ProgramDescription: description,
                ProgramStartDate: startDate,
                ProgramEndDate: endDate,
                ProgramSubject: subject,
                ProgramPrice: price,
                instructor_id: instructorId
              };
              
              console.log('Mapped program:', mappedProgram);
              return mappedProgram;
            });
            
            // Log the mapped data for debugging
            console.log('Mapped data (first item):', mappedData[0]);
            
            this.debugData = data;
            this.loading = false;
            
            // Update the table with the mapped data
            this.mentorshipPrograms = mappedData;
            this.filteredMentorshipPrograms = [...this.mentorshipPrograms];
            this.extractFilters();
            this.paginate();
            console.log('Updated table with', this.mentorshipPrograms.length, 'programs');
          } else {
            console.warn('Received empty or non-array data:', data);
            this.debugData = data;
            this.loading = false;
          }
        } catch (e: unknown) {
          // Fix TypeScript error by properly handling unknown type
          const errorMessage = e instanceof Error ? e.message : String(e);
          console.error('Error parsing JSON:', e);
          this.error = `Failed to parse server response: ${errorMessage}`;
          this.debugData = { 
            error: errorMessage, 
            rawData: text.substring(0, 1000) + '...' 
          };
          this.loading = false;
        }
      })
      .catch(error => {
        // Proper error handling
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('API test failed:', error);
        this.error = `API test failed: ${errorMessage}`;
        this.debugData = { error: errorMessage };
        this.loading = false;
      });
  }
  
  // Process the fetched data
  processMentorshipPrograms(data: any) {
    if (Array.isArray(data)) {
      this.mentorshipPrograms = data;
      this.filteredMentorshipPrograms = [...this.mentorshipPrograms];
      this.extractFilters();
      this.paginate();
      console.log('Processed', this.mentorshipPrograms.length, 'mentorship programs');
    } else {
      console.error('Expected array but got:', typeof data);
      this.error = 'Invalid data format received from API';
    }
  }

  // Fetch mentorship programs
  fetchMentorshipPrograms() {
    this.loading = true;
    this.error = null;
    
    this.mentorshipProgramService.getMentorshipPrograms().subscribe({
      next: (data: MentorshipProgram[]) => {
        this.mentorshipPrograms = data;
        this.filteredMentorshipPrograms = [...data];
        this.extractFilters();
        this.paginate();
        this.loading = false;
        this.inspectLoadedData(); // Add this line
      },
      error: (err) => {
        console.error('Error fetching mentorship programs:', err);
        this.error = `Failed to fetch mentorship programs: ${err.message}`;
        this.loading = false;
        
        // Try debug method as fallback
        this.debugFetchPrograms();
      }
    });
  }


createOrUpdateMentorshipProgram(isUpdate: boolean) {
  // Set form submission flag to show validation errors
  this.formSubmitted = true;
  
  // Get Angular form reference
  const ngForm = isUpdate ? this.editMentorshipProgramForm : this.mentorshipProgramForm;
  
  // If we have a form reference, validate it properly
  if (ngForm) {
    // Mark all controls as touched to trigger validation styling
    Object.keys(ngForm.controls).forEach(key => {
      const control = ngForm.controls[key];
      control.markAsTouched();
      control.markAsDirty(); // Ensures validation styling appears immediately
      control.updateValueAndValidity();
    });
    
    // Use Angular's validation system instead of DOM validation
    if (ngForm.invalid) {
      console.log('Form validation failed - fields with errors:');
      Object.keys(ngForm.controls)
        .filter(key => ngForm.controls[key].invalid)
        .forEach(key => {
          console.log(`- Field "${key}": `, ngForm.controls[key].errors);
        });
      this.showToast('Please fill in all required fields correctly', 'warning');
      return; // Don't proceed if form is invalid
    }
  }
  
  // At this point, form is valid, proceed with data submission
  this.loading = true;
  this.error = null;
  
  const program = isUpdate ? this.selectedMentorshipProgram : this.newMentorshipProgram;
  
  if (!program) {
    this.error = "No program data available";
    this.loading = false;
    this.showToast("No program data available", "error");
    return;
  }
  
  // Log the program data being sent
  console.log(`PROGRAM DATA BEING SENT:`, JSON.stringify(program, null, 2));
  
  // For create operations
  if (!isUpdate && program.idMentorshipProgram === 0) {
    // Make a copy to avoid modifying the original
    const programCopy = {
      ...program,
      // Ensure instructor_id is a number (not undefined)
      instructor_id: program.instructor_id || 0
    };
    
    // Use the service methods with debug info
    this.mentorshipProgramService.addMentorshipProgram(programCopy).subscribe({
      next: (data: any) => {
        console.log(`Program created successfully:`, data);
        
        // Store the original instructor ID before processing response
        const originalInstructorId = programCopy.instructor_id;
        
        // Transform received data to match frontend model
        const newProgram: MentorshipProgram = {
          idMentorshipProgram: data.idMentorshipProgram || 0,
          ProgramName: data.programName || programCopy.ProgramName || '',
          ProgramDescription: data.programDescription || programCopy.ProgramDescription || '',
          ProgramSubject: data.programSubject || programCopy.ProgramSubject || '',
          ProgramPrice: data.programPrice || programCopy.ProgramPrice || 0,
          ProgramStartDate: data.programStartDate ? new Date(data.programStartDate) : programCopy.ProgramStartDate,
          ProgramEndDate: data.programEndDate ? new Date(data.programEndDate) : programCopy.ProgramEndDate,
          // Better instructor ID handling with guaranteed number result
          instructor_id: this.extractInstructorFromResponse(data, originalInstructorId)
        };
        
        console.log('Final mapped instructor_id:', newProgram.instructor_id);
        
        // Add new program to array
        this.mentorshipPrograms.push(newProgram);
        
        // Update filtered and paginated views
        this.filteredMentorshipPrograms = [...this.mentorshipPrograms];
        this.extractFilters();
        this.paginate();
        
        // Reset UI state
        this.loading = false;
        this.showCreateForm = false;
        this.resetForm(); // Reset the form
        
        // Success notification
        this.showToast('Mentorship Program created successfully!', 'success');
        this.triggerConfetti();
      },
      error: this.handleOperationError('create')
    });
  } else if (isUpdate && program.idMentorshipProgram) {
    // Create a copy with ensured instructor_id
    const programToUpdate = {
      ...program,
      // Ensure instructor_id is a number (not undefined)
      instructor_id: program.instructor_id || 0
    };
    
    // Update existing program
    this.mentorshipProgramService.editMentorshipProgram(programToUpdate).subscribe({
      next: (data: any) => {
        console.log(`Program updated successfully:`, data);
        
        // Store the original instructor ID before processing response
        const originalInstructorId = programToUpdate.instructor_id;
        
        // Transform received data to match frontend model
        const updatedProgram: MentorshipProgram = {
          idMentorshipProgram: data.idMentorshipProgram || programToUpdate.idMentorshipProgram,
          ProgramName: data.programName || programToUpdate.ProgramName,
          ProgramDescription: data.programDescription || programToUpdate.ProgramDescription,
          ProgramSubject: data.programSubject || programToUpdate.ProgramSubject,
          ProgramPrice: data.programPrice || programToUpdate.ProgramPrice,
          ProgramStartDate: data.programStartDate ? new Date(data.programStartDate) : programToUpdate.ProgramStartDate,
          ProgramEndDate: data.programEndDate ? new Date(data.programEndDate) : programToUpdate.ProgramEndDate,
          // Better instructor ID handling with guaranteed number result
          instructor_id: this.extractInstructorFromResponse(data, originalInstructorId)
        };
        
        console.log('Final mapped instructor_id:', updatedProgram.instructor_id);
        
        // Update existing program in array
        const index = this.mentorshipPrograms.findIndex(p => 
          p.idMentorshipProgram === programToUpdate.idMentorshipProgram);
        if (index !== -1) {
          this.mentorshipPrograms[index] = updatedProgram;
        }
        
        // Update filtered and paginated views
        this.filteredMentorshipPrograms = [...this.mentorshipPrograms];
        this.extractFilters();
        this.paginate();
        
        // Reset UI state
        this.loading = false;
        this.selectedMentorshipProgram = null;
        
        // Success notification
        this.showToast('Mentorship Program updated successfully!', 'success');
        this.triggerConfetti();
      },
      error: this.handleOperationError('update')
    });
  } else {
    this.error = `Invalid program data for ${isUpdate ? 'update' : 'create'} operation`;
    this.loading = false;
    this.showToast(this.error, 'error');
  }
}

// Add this helper method for better error handling
// Update the error handler to use toasts
private handleOperationError(operation: string) {
  return (err: any) => {
    console.error(`Failed to ${operation} program:`, err);
    
    // Log detailed error information
    if (err.error) console.error('Server error details:', err.error);
    if (err.status) console.error('HTTP status:', err.status);
    
    // User-friendly error message
    let errorMsg = err.message || 'Unknown error';
    if (err.status === 400) {
      errorMsg = 'Invalid data provided. Please check all fields.';
    } else if (err.status === 0) {
      errorMsg = 'Server connection failed. Is the backend running?';
    } else if (err.status === 415) {
      errorMsg = 'Unsupported media type. Check request format.';
    }
    
    // Show error in UI
    this.error = `Operation failed: ${errorMsg}`;
    
    // Replace alert with toast
    this.showToast(`Failed to ${operation} program: ${errorMsg}`, 'error');
    this.loading = false;
  };
}

inspectLoadedData() {
  console.log('🔍 INSPECTING LOADED DATA:');
  console.log(`📊 Total programs: ${this.mentorshipPrograms.length}`);
  
  if (this.mentorshipPrograms.length > 0) {
    const sample = this.mentorshipPrograms[0];
    console.log('📝 Sample program fields:', Object.keys(sample));
    console.log('📝 Sample program values:');
    console.log(`   ID: ${sample.idMentorshipProgram}`);
    console.log(`   Name: ${sample.ProgramName}`);
    console.log(`   Description: ${sample.ProgramDescription?.substring(0, 30)}...`);
    console.log(`   Price: ${sample.ProgramPrice}`);
  } else {
    console.log('❌ No programs loaded');
  }

  // Add a debug button to the UI
  this.debugData = {
    programCount: this.mentorshipPrograms.length,
    sample: this.mentorshipPrograms.length > 0 ? this.mentorshipPrograms[0] : null
  };
}

// Add this method to your mentorship component
triggerConfetti() {
  if (!this.confettiCanvas) return;
  
  const canvas = this.confettiCanvas.nativeElement;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const pieces: any[] = [];
  const numberOfPieces = 200;
  const colors = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0'];

  function randomFromTo(from: number, to: number) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }
  
  for (let i = 0; i < numberOfPieces; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: randomFromTo(5, 10),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speed: randomFromTo(1, 5),
      friction: 0.95,
      opacity: 1,
      yVel: 0,
      xVel: 0
    });
  }
  
  let rendered = 0;
  
  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    pieces.forEach((piece, i) => {
      piece.opacity -= 0.01;
      piece.yVel += 0.25;
      piece.xVel *= piece.friction;
      piece.yVel *= piece.friction;
      piece.rotation += 1;
      piece.x += piece.xVel + Math.random() * 2 - 1;
      piece.y += piece.yVel;
      
      if (piece.opacity <= 0) {
        pieces.splice(i, 1);
        return;
      }
      
      ctx.beginPath();
      ctx.arc(piece.x, piece.y, piece.radius, 0, Math.PI * 2);
      ctx.fillStyle = piece.color;
      ctx.globalAlpha = piece.opacity;
      ctx.fill();
    });

    rendered += 1;
    if (pieces.length > 0 && rendered < 500) {
      requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  // Initialize confetti velocities
  pieces.forEach((piece) => {
    piece.xVel = (Math.random() - 0.5) * 20;
    piece.yVel = (Math.random() - 0.5) * 20;
  });
  
  renderConfetti();
}
// Add these methods below your triggerConfetti method
showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  console.log('Showing toast:', message, type);
  
  // Add to toasts array
  this.toasts = [...this.toasts, { message, type }];
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (this.toasts.length > 0) {
      this.toasts = this.toasts.slice(1);
    }
  }, 5000);
}

removeToast(index: number) {
  this.toasts = this.toasts.filter((_, i) => i !== index);
}

// Add this helper method to your MentorshipPorgramComponent class
// Improved extractInstructorFromResponse method
private extractInstructorFromResponse(data: any, fallbackId: number): number {
  console.log('Extracting instructor from response:', data);
  
  // CASE 1: Check for nested instructor object
  if (data.instructor && typeof data.instructor === 'object') {
    if (data.instructor.idInstructor !== undefined) {
      console.log('Found instructor ID in instructor.idInstructor:', data.instructor.idInstructor);
      return Number(data.instructor.idInstructor);
    }
    if (data.instructor.id !== undefined) {
      console.log('Found instructor ID in instructor.id:', data.instructor.id);
      return Number(data.instructor.id);
    }
  }
  
  // CASE 2: Check for direct instructor_id property
  if (data.instructor_id !== undefined && data.instructor_id !== null) {
    console.log('Found instructor_id property:', data.instructor_id);
    return Number(data.instructor_id);
  }
  
  // CASE 3: Check for instructorId property
  if (data.instructorId !== undefined && data.instructorId !== null) {
    console.log('Found instructorId property:', data.instructorId);
    return Number(data.instructorId);
  }
  
  // CASE 4: If all else fails, use the fallback ID
  console.log('Using fallback instructor ID:', fallbackId);
  return fallbackId;
}
}