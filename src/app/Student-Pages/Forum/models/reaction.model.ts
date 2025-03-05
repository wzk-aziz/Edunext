import { Thread } from './thread.model';
import { Forum } from './forum.model';

export interface Reaction {
  id: number | null;
  reactionType: 'LIKE' | 'LOVE' | 'HAHA' | 'COMMENT';
  reactionContent: string; // <-- Doit être un string si toujours présent
  studentEmail: string;
  thread?: Thread;
}
