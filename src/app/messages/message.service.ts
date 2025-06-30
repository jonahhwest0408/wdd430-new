import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();

  // 🔁 Updated backend URL
  private backendUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMessages(): void {
    this.http.get<{ message: string, messages: Message[] }>(this.backendUrl).subscribe(
      (responseData) => {
        this.messages = responseData.messages || [];
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  getMessage(id: string): Message | undefined {
    return this.messages.find((msg) => msg.id === id);
  }

  addMessage(message: Message) {
    if (!message) return;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // clear id so backend generates one
    message.id = '';

    this.http.post<{ message: string, messageObj: Message }>(this.backendUrl, message, { headers }).subscribe(
      (responseData) => {
        this.messages.push(responseData.messageObj);
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.error('Error adding message:', error);
      }
    );
  }
}
