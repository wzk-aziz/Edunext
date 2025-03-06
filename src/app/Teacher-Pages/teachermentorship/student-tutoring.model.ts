export interface studnettutoring {
  idMentorshipProgram: number;
  programName: string;
  programDescription: string;
  programSubject: string;
  programPrice: number;
  programStartDate?: string;
  programEndDate?: string;
  instructorId: number;
  instructorName?: string;
}