export enum QuestionType {
    SINGLE_CHOICE = 'SINGLE_CHOICE',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'
  }
  
  export interface Question {
    id?: number;
    questionText: string;
    questionType: QuestionType;
    // List of possible answers (as strings)
    answerOptions: string[];
    // Correct answer(s); for SINGLE_CHOICE, this should be an array with one element.
    correctAnswers: string[];
    points: number;
    explanation: string;
    // Link back to quiz
    quizId?: number;
  }