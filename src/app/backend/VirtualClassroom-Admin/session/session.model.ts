export interface Session {
  idSession?: number;
  titleSession: string;
  sessionSubject: string | null;
  startTime: Date | string | null;
  sessionDuration: number;
  instructor: any | null;
  instructorId?: number;
  learners?: any[];
  sessionRecording?: any | null;
  feedbacks?: any[];
  chatMessages?: any[];
}