import { Course } from "./course.model";
import { Question } from "./question.model";

export interface Quiz {
    id?: number;
    title: string;
    description: string;
    timeLimit: number;  // in minutes
    totalPoints: number;
    // Optionally link to a course (or use courseId if preferred)
    courseId?: number|null;
    // If you want to include the entire course details:
    course?: Course;
    // A quiz contains many questions
    questions?: Question[];
  }