import { Question } from "./Question";

export class exam {
    idExam?: number;
    examTitle?: string;
    examDescription?: string;
    examDuration?:number;
    totalMarks?:number;
    passingScore?: number;
    scheduledDate?: string;
    questions?: Question[] ;
  }