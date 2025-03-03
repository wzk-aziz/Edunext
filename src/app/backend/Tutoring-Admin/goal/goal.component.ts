import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GoalService } from '../Tutoring-Services/goal.service';
import { Goal } from './goal.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css']
})
export class GoalComponent implements OnInit {
  goals: Goal[] = [];
  filteredGoals: Goal[] = [];
  newGoal: Goal = { 
    idGoal: 0, 
    goalDescription: '', 
    goalTargetDate: '', 
    mentorshipProgramId: 0 
  };
  selectedGoal: Goal | null = null;
  showCreateForm = false;
  searchTerm: string = '';
  loading: boolean = false;
  error: string | null = null;

    // Pagination properties
    paginatedGoals: Goal[] = []; // For pagination
    currentPage: number = 1;
    pageSize: number = 5;
    pageSizeOptions: number[] = [5, 10, 25, 50];
    Math = Math; // For template access
    
    // Existing properties...
  
        // Add after your existing properties
    formSubmitted = false;
    @ViewChild('goalForm') goalForm!: NgForm;
    @ViewChild('editGoalForm') editGoalForm!: NgForm;
    @ViewChild('confettiCanvas') confettiCanvas: ElementRef | undefined;

  filters: {
    dateFrom: string | null;
    dateTo: string | null;
    programId: number | null;
  } = {
    dateFrom: null,
    dateTo: null,
    programId: null
  };

  constructor(private goalService: GoalService) {}

  // In goal.component.ts
  ngOnInit(): void {
    console.log('🚀 Goal Component initializing...');
    
    // Test direct API access to diagnose issues
    fetch('http://localhost:8087/goals/all')
      .then(res => {
        console.log('🔍 Direct API status:', res.status, res.statusText);
        return res.text(); // Get raw text first to see what's coming back
      })
      .then(text => {
        console.log('📝 Raw API response text:', text);
        try {
          // Try to parse it as JSON
          const data = JSON.parse(text);
          console.log('✅ Direct API parsed data:', data);
        } catch (e) {
          console.error('❌ Failed to parse response as JSON:', e);
        }
      })
      .catch(err => console.error('❌ Direct API fetch error:', err));
  
    // Regular fetch
    this.fetchGoals();
  }

  fetchGoals(): void {
    this.loading = true;
    this.error = null;
    
    this.goalService.getGoals().subscribe({
      next: (data: Goal[]) => {
        console.log('Goals received:', data);
        this.goals = data;
        this.filteredGoals = data;
        this.currentPage = 1; // Reset to first page
        this.paginate(); // Add this line to paginate the results
        this.loading = false;
        this.inspectLoadedData(); // Add this line
      },
      error: (error) => {
        console.error('Failed to fetch goals:', error);
        this.error = `Failed to load goals: ${error.message}`;
        this.loading = false;
      }
    });
  }


filterGoals(): void {
  if (!this.searchTerm && !this.filters.dateFrom && !this.filters.dateTo && !this.filters.programId) {
    this.filteredGoals = [...this.goals];
    return;
  }
  
  let filtered = [...this.goals];
  
  // Apply text search
  if (this.searchTerm) {
    const search = this.searchTerm.toLowerCase();
    filtered = filtered.filter(goal => 
      goal.goalDescription.toLowerCase().includes(search) ||
      goal.mentorshipProgramId.toString().includes(search)
    );
  }
  
  // Apply date from filter with better handling
  if (this.filters.dateFrom) {
    const fromDate = new Date(this.filters.dateFrom);
    fromDate.setHours(0, 0, 0, 0); // Start of day
    
    filtered = filtered.filter(goal => {
      const goalDate = new Date(goal.goalTargetDate);
      goalDate.setHours(0, 0, 0, 0); // Normalize time part
      return !isNaN(goalDate.getTime()) && goalDate >= fromDate;
    });
  }
  
  // Apply date to filter with better handling
  if (this.filters.dateTo) {
    const toDate = new Date(this.filters.dateTo);
    toDate.setHours(23, 59, 59, 999); // End of day
    
    filtered = filtered.filter(goal => {
      const goalDate = new Date(goal.goalTargetDate);
      goalDate.setHours(0, 0, 0, 0); // Normalize time part
      return !isNaN(goalDate.getTime()) && goalDate <= toDate;
    });
  }
  
  // Apply program ID filter
  if (this.filters.programId) {
    filtered = filtered.filter(goal => 
      goal.mentorshipProgramId === this.filters.programId
    );
  }
  
  this.filteredGoals = filtered;
  this.currentPage = 1; // Reset to first page when filtering
  this.paginate(); // Add this line to paginate the filtered results

}

  clearFilters(): void {
    this.filters = {
      dateFrom: null,
      dateTo: null,
      programId: null
    };
    this.searchTerm = '';
    this.filterGoals();
  }


  // Fix create method
  // Replace existing createGoal method
  createGoal(): void {
    // Set formSubmitted to true immediately to show validation errors
    this.formSubmitted = true;
    
    // Force Angular to run validation before continuing
    setTimeout(() => {
      // Check form validity
      if (this.goalForm && this.goalForm.invalid) {
        this.showToast('Please fill in all required fields correctly', 'warning');
        return;
      }
      
      // Proceed with valid form
      this.loading = true;
      this.error = null;
      
      console.log('Creating goal with data:', this.newGoal);
      
      this.goalService.createGoal(this.newGoal).subscribe({
        next: (data: Goal) => {
          console.log('Goal created:', data);
          
          // Ensure the returned goal has all properties properly set
          const createdGoal: Goal = {
            idGoal: data.idGoal,
            goalDescription: data.goalDescription,
            goalTargetDate: data.goalTargetDate,
            mentorshipProgramId: data.mentorshipProgramId || this.newGoal.mentorshipProgramId,
            mentorshipProgram: data.mentorshipProgram
          };
          
          this.goals.push(createdGoal);
          this.filteredGoals = [...this.goals];
          this.paginate();
          
          this.newGoal = { 
            idGoal: 0, 
            goalDescription: '', 
            goalTargetDate: '', 
            mentorshipProgramId: 0 
          };
          this.showCreateForm = false;
          this.loading = false;
          this.formSubmitted = false;
          
          // Replace alert with toast and confetti
          this.showToast('Goal created successfully!', 'success');
          this.triggerConfetti();
        },
        error: (error) => {
          console.error('Failed to create goal:', error);
          this.error = `Failed to create goal: ${error.message}`;
          this.loading = false;
          this.showToast(`Failed to create goal: ${error.message}`, 'error');
        }
      });
    }, 0);
  }
  
  updateGoal(): void {
    // Early null check to avoid TypeScript errors
    if (!this.selectedGoal) {
      console.error('Cannot update: No goal selected');
      this.showToast('No goal selected for update', 'error');
      return;
    }
    
    // Set formSubmitted to true immediately to show validation errors
    this.formSubmitted = true;
    
    // Force Angular to run validation before continuing
    setTimeout(() => {
      // Check form validity
      if (this.editGoalForm && this.editGoalForm.invalid) {
        this.showToast('Please fill in all required fields correctly', 'warning');
        return;
      }
      
      // Proceed with valid form (only set loading true once validation passes)
      this.loading = true;
      this.error = null;
      
      console.log('Updating goal with data:', this.selectedGoal);
      
      this.goalService.updateGoal(this.selectedGoal!).subscribe({
        next: (data: Goal) => {
          console.log('Goal updated:', data);
          
          // Ensure the returned goal has all properties properly set
          const updatedGoal: Goal = {
            idGoal: data.idGoal || this.selectedGoal!.idGoal,
            goalDescription: data.goalDescription || this.selectedGoal!.goalDescription,
            goalTargetDate: data.goalTargetDate || this.selectedGoal!.goalTargetDate,
            mentorshipProgramId: data.mentorshipProgramId || this.selectedGoal!.mentorshipProgramId,
            mentorshipProgram: data.mentorshipProgram
          };
          
          // Update the array with the new data
          const index = this.goals.findIndex(g => g.idGoal === updatedGoal.idGoal);
          if (index !== -1) {
            this.goals[index] = updatedGoal;
          }
          this.filteredGoals = [...this.goals];
          this.paginate();
          
          // Reset UI state
          this.selectedGoal = null;
          this.loading = false;
          this.formSubmitted = false;
          
          // Success notification
          this.showToast('Goal updated successfully!', 'success');
          this.triggerConfetti();
        },
        error: (error) => {
          console.error('Failed to update goal:', error);
          this.error = `Failed to update goal: ${error.message}`;
          this.loading = false;
          this.formSubmitted = false; // Also reset form submitted on error
          this.showToast(`Failed to update goal: ${error.message}`, 'error');
        }
      });
    }, 0);
  }

  // Replace existing deleteGoal method
  deleteGoal(id: number): void {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    this.loading = true;
    this.error = null;
    
    this.goalService.deleteGoal(id).subscribe({
      next: () => {
        console.log('Goal deleted:', id);
        this.goals = this.goals.filter(goal => goal.idGoal !== id);
        this.filteredGoals = [...this.goals];
        this.paginate();
        this.loading = false;
        
        // Replace alert with toast and confetti
        this.showToast('Goal deleted successfully!', 'success');
        this.triggerConfetti();
      },
      error: (error) => {
        console.error('Failed to delete goal:', error);
        this.error = `Failed to delete goal: ${error.message}`;
        this.loading = false;
        this.showToast(`Failed to delete goal: ${error.message}`, 'error');
      }
    });
  }

  selectGoal(goal: Goal): void {
    this.selectedGoal = { ...goal };
  }

  clearSelection(): void {
    this.selectedGoal = null;
    this.formSubmitted = false;
  }

// Add to goal.component.ts
loadTestData(): void {
  console.log('Loading test goal data');
  this.goals = [
    {
      idGoal: 1,
      goalDescription: 'Learn Angular Fundamentals',
      goalTargetDate: '2025-04-15',
      mentorshipProgramId: 1
    },
    {
      idGoal: 2,
      goalDescription: 'Master Spring Boot',
      goalTargetDate: '2025-05-20',
      mentorshipProgramId: 1
    }
  ];
  this.filteredGoals = [...this.goals];
}

inspectLoadedData() {
  console.log('🔍 INSPECTING LOADED GOALS:');
  console.log(`📊 Total goals: ${this.goals.length}`);
  
  if (this.goals.length > 0) {
    const sample = this.goals[0];
    console.log('📝 Sample goal fields:', Object.keys(sample));
    console.log('📝 Sample goal values:');
    console.log(`   ID: ${sample.idGoal}`);
    console.log(`   Description: ${sample.goalDescription?.substring(0, 30)}...`);
    console.log(`   Target Date: ${sample.goalTargetDate}`);
    console.log(`   Program ID: ${sample.mentorshipProgramId}`);
  } else {
    console.log('❌ No goals loaded');
  }
}

// Add these methods to your GoalComponent class

  // Paginate the filtered goals
  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedGoals = this.filteredGoals.slice(startIndex, endIndex);
    console.log(`📄 Showing page ${this.currentPage} (${startIndex}-${endIndex}) of ${this.filteredGoals.length} filtered goals`);
  }

  // Go to next page
  nextPage(): void {
    if (this.currentPage < Math.ceil(this.filteredGoals.length / this.pageSize)) {
      this.currentPage++;
      this.paginate();
    }
  }

  // Go to previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  // Change the page size
  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.paginate();
  }

    // Add after your existing methods
  
  // Show toast notification
  showToast(message: string, type: 'success' | 'warning' | 'error' | 'info'): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }
  
  // Confetti animation
  // Add this method to your goal.component.ts
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

  // Add this method if you don't already have it
resetForm(): void {
  this.newGoal = { 
    idGoal: 0, 
    goalDescription: '', 
    goalTargetDate: '', 
    mentorshipProgramId: 0 
  };
  this.formSubmitted = false;
  this.showCreateForm = false;
}




}