import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  private maxMessageId: number = 0;

  private firebaseUrl = 'https://wdd430-9af8f-default-rtdb.firebaseio.com/messages.json';

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMessages(): void {
    this.http.get<Message[]>(this.firebaseUrl).subscribe(
      (messages: Message[]) => {
        this.messages = messages || [];
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  getMessage(id: string): Message {
    return this.messages.find((msg) => msg.id === id)!;
  }

  addMessage(message: Message) {
    if (!message) return;

    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages();
  }

  private storeMessages(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(this.firebaseUrl, this.messages, { headers }).subscribe(() => {
      this.messageChangedEvent.emit(this.messages.slice());
    });
  }

  private getMaxId(): number {
    let maxId = 0;
    for (let msg of this.messages) {
      const currentId = parseInt(msg.id ?? '0');
      if (!isNaN(currentId) && currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
