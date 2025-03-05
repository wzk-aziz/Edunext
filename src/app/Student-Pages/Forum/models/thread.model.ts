import { Forum } from './forum.model';
import { Reaction } from './reaction.model';

export interface Thread {
  id?: number;
  threadTitle: string;
  threadContent: string;
  forum?: Forum;
  reactions?: Reaction[];
}