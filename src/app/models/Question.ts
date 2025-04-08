export class Question {
    id?: number ;
    questionText?: string ;
    answerOptions?: string | string[]; // Modifier selon la structure des options
    idExam?:number;
    correctAnswer?: string ;
  }