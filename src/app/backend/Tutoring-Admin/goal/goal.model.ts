export interface Goal {
  idGoal: number;
  goalDescription: string;
  goalTargetDate: string;
  mentorshipProgramId: number;
  
  // Optional property for when you need the full relationship object
  mentorshipProgram?: {
    idMentorshipProgram?: number;
    // Add other properties if needed
  };
}