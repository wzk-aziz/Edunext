export interface Submission {
  id?: number;
  code: string;
  language?: {
    id: number;
    name?: string;
  };
  status?: string;
  output?: string;
  problem?: {
    id: number;
    title?: string;
    expectedOutput?: string;
  };
  gitLink?: string;
  student?: {
    id: number;
    name?: string;
    email?: string; // Add email field
  };
  score?: number;
  
  // For form submission
  problemId?: number;
  studentId?: number;
}