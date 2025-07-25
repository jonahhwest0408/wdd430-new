import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  standalone: false
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.getMessages();
  
    this.messageService.messageChangedEvent.subscribe((updatedMessages: Message[]) => {
      this.messages = updatedMessages;
    });
  }
  
}
