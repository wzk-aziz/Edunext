export interface MentorshipProgram {
  // Update to match your backend camelCase properties
  idMentorshipProgram: number;
  programName: string;
  programDescription: string;
  programSubject: string;
  programPrice: number;
  programStartDate: string;
  programEndDate: string;
  instructorId: number; // Assuming this is in your backend relation
  
  // Keep this field for our frontend display
  instructor_name?: string;
}