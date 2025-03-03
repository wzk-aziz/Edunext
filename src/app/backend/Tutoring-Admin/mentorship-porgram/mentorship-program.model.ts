// In mentorship-program.model.ts
export interface MentorshipProgram {
  idMentorshipProgram: number;
  ProgramName: string;
  ProgramDescription: string;
  ProgramStartDate: Date;
  ProgramEndDate: Date;
  ProgramSubject: string;
  ProgramPrice: number;
  instructor_id: number;
}