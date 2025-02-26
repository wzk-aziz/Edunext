export interface ChatMessage {
  idChatMessage?: number;
  contentChatMessage: string;
  session: any; // Make this 'any' to be more flexible
}