import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
  standalone: false
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Welcome', 'Welcome to the app!', 'Admin'),
    new Message('2', 'Reminder', 'Don\'t forget the meeting at 3 PM.', 'Alice'),
    new Message('3', 'Check-In', 'How are you doing today?', 'Bob')
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}