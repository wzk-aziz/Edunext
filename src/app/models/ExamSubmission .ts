import { exam } from "./exam";
import { User } from "./User";

export interface ExamSubmission {
  id: number;
  user: User;
  exam: exam;
  userAnswers: { [key: number]: string };  // Map des réponses de l'utilisateur
  score: number;
  submissionDate: string;
   }
  