export class Certificate {
  
    id?: number;
    certificateTitle?: string;
    userFullName?: string;
    issuedDate?: string;
    exam?: {
      idExam: number;
      examTitle: string;
      examDescription: string;
      examDuration: number;
      totalMarks: number;
      passingScore: number;
      scheduledDate: string;
      questions: {
        id: number;
        questionText: string;
        answerOptions: string;
        correctAnswer: string;
      }[];
    };
  }
  
    
  
  