export interface ClassroomSession {
  idSession?: number;
  titleSession: string;
  sessionSubject: string | null;
  startTime: Date | string | null;
  endTime?: Date | string | null;
  sessionDuration: number;
  
  // Add instructor ID to match your database
  instructorId?: number;
  instructorName: string;
  
  // Rest of your model...
  status: 'live' | 'upcoming' | 'completed';
  description?: string;
  sessionRecordingUrl?: string | null;
  canJoin?: boolean;
  learnerCount?: number;
  maxLearners?: number;
}