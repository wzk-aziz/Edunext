export interface Feedback {
  idFeedback?: number;
  contentFeedback: string;
  rating: number;
  session: number | { idSession: number };
}