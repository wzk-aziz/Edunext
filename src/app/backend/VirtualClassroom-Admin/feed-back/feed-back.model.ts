// feed-back.model.ts
export interface Feedback {
  idFeedback?: number;
  contentFeedback: string;
  rating: number;
  session: number | { idSession: number };
  sessionId?: number; // Add this property
}