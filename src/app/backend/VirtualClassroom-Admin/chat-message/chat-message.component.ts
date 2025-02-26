import { Component, OnInit } from '@angular/core';
import { ChatMessageService } from './chat-message.service';
import { ChatMessage } from './chat-message.model';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  chatMessages: ChatMessage[] = [];
  filteredChatMessages: ChatMessage[] = [];
  newChatMessage: ChatMessage = { id_chat_message: 0, content_chat_message: '', session_id: 0 };
  selectedChatMessage: ChatMessage | null = null;
  showCreateForm = false;
  searchTerm: string = '';

  constructor(private chatMessageService: ChatMessageService) {}

  ngOnInit(): void {
    this.fetchChatMessages();
  }

  fetchChatMessages(): void {
    this.chatMessageService.getChatMessages().subscribe((data: ChatMessage[]) => {
      this.chatMessages = data;
      this.filteredChatMessages = data;
    });
  }

  filterChatMessages(): void {
    this.filteredChatMessages = this.chatMessages.filter(chatMessage =>
      chatMessage.content_chat_message.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      chatMessage.session_id.toString().includes(this.searchTerm)
    );
  }

  createChatMessage(): void {
    this.chatMessageService.createChatMessage(this.newChatMessage).subscribe((data: ChatMessage) => {
      this.chatMessages.push(data);
      this.filteredChatMessages = this.chatMessages;
      this.newChatMessage = { id_chat_message: 0, content_chat_message: '', session_id: 0 };
      this.showCreateForm = false;
    });
  }

  updateChatMessage(): void {
    if (this.selectedChatMessage) {
      this.chatMessageService.updateChatMessage(this.selectedChatMessage).subscribe(() => {
        this.fetchChatMessages();
        this.selectedChatMessage = null;
      });
    }
  }

  deleteChatMessage(id: number): void {
    this.chatMessageService.deleteChatMessage(id).subscribe(() => {
      this.chatMessages = this.chatMessages.filter(msg => msg.id_chat_message !== id);
      this.filteredChatMessages = this.chatMessages;
    });
  }

  selectChatMessage(chatMessage: ChatMessage): void {
    this.selectedChatMessage = { ...chatMessage };
  }

  clearSelection(): void {
    this.selectedChatMessage = null;
  }
}