export interface ProgressReport {
  idReport: number;
  reportContent: string;
  reportDate: Date;
  
  // For component use - make these non-optional
  learnerId: number;
  mentorshipProgramId: number;
  
  // For backend communication - make these optional
  learner?: {
    idLearner: number;
  };
  mentorshipProgram?: {
    idMentorshipProgram: number;
  };
}