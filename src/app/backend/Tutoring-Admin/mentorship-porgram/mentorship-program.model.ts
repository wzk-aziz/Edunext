export interface MentorshipProgram {
  idMentorshipProgram: number;
  ProgramName: string;
  ProgramDescription: string;
  ProgramStartDate: Date | string; // Updated to accept both Date and string
  ProgramEndDate: Date | string;   // Updated to accept both Date and string
  ProgramSubject: string;
  ProgramPrice: number;
  instructor_id?: number; // Keep this for relationship handling
}