import { Component, OnInit } from '@angular/core';
import { MentorshipProgramService } from './mentorship-program.service';
import { MentorshipProgram } from './mentorship-program.model';

@Component({
  selector: 'app-mentorship-porgram',
  templateUrl: './mentorship-porgram.component.html',
  styleUrls: ['./mentorship-porgram.component.css']
})
export class MentorshipPorgramComponent implements OnInit {
  displayedColumns: string[] = [
    'id_mentorship_program', 
    'program_name', 
    'program_description', 
    'program_price', 
    'program_start_date', 
    'program_end_date', 
    'program_subject', 
    'instructor_id', 
    'actions'
  ];
  mentorshipPrograms: MentorshipProgram[] = [];
  filteredMentorshipPrograms: MentorshipProgram[] = [];
  newMentorshipProgram: MentorshipProgram = {
    id_mentorship_program: 0,
    program_description: '',
    program_end_date: new Date(),
    program_name: '',
    program_price: 0,
    program_start_date: new Date(),
    program_subject: '',
    instructor_id: 0
  };
  selectedMentorshipProgram: MentorshipProgram | null = null;
  showCreateForm = false;
  searchTerm: string = '';

  constructor(private mentorshipProgramService: MentorshipProgramService) {}

  ngOnInit(): void {
    this.fetchMentorshipPrograms();
  }

  fetchMentorshipPrograms() {
    this.mentorshipProgramService.getMentorshipPrograms().subscribe((data: MentorshipProgram[]) => {
      this.mentorshipPrograms = data;
      this.filteredMentorshipPrograms = data;
    }, error => {
      console.error('Error fetching mentorship programs:', error);
    });
  }

  filterMentorshipPrograms() {
    this.filteredMentorshipPrograms = this.mentorshipPrograms.filter(program =>
      program.program_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      program.program_description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  createMentorshipProgram(): void {
    this.mentorshipProgramService.addMentorshipProgram(this.newMentorshipProgram).subscribe((data: MentorshipProgram) => {
      this.mentorshipPrograms.push(data);
      this.filteredMentorshipPrograms = this.mentorshipPrograms;
      this.newMentorshipProgram = {
        id_mentorship_program: 0,
        program_description: '',
        program_end_date: new Date(),
        program_name: '',
        program_price: 0,
        program_start_date: new Date(),
        program_subject: '',
        instructor_id: 0
      };
      this.showCreateForm = false;
    });
  }

  updateMentorshipProgram(): void {
    if (this.selectedMentorshipProgram) {
      this.mentorshipProgramService.editMentorshipProgram(this.selectedMentorshipProgram).subscribe(() => {
        this.fetchMentorshipPrograms();
        this.selectedMentorshipProgram = null;
      });
    }
  }

  deleteMentorshipProgram(id: number): void {
    this.mentorshipProgramService.deleteMentorshipProgram(id).subscribe(() => {
      this.mentorshipPrograms = this.mentorshipPrograms.filter(program => program.id_mentorship_program !== id);
      this.filteredMentorshipPrograms = this.mentorshipPrograms;
    });
  }

  selectMentorshipProgram(program: MentorshipProgram): void {
    this.selectedMentorshipProgram = { ...program };
  }

  clearSelection(): void {
    this.selectedMentorshipProgram = null;
  }
}