import { Thread } from './thread.model';
import { Forum } from './forum.model';

export interface Reaction {
  id?: number;
  threadId: number;
  studentEmail: string;
  type: string; // Not 'reactionType'
  content?: string; // For comments  // Pour le contenu des commentaires
  timestamp?: Date;
}