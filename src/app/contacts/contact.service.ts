import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contacts.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();

  contacts: Contact[] = [];
  private maxContactId: number = 0;

  private firebaseUrl = 'https://wdd430-9af8f-default-rtdb.firebaseio.com/contacts.json';

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  getContacts(): void {
    this.http.get<Contact[]>(this.firebaseUrl).subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts || [];
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => a.name.localeCompare(b.name));
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  getContact(id: string): Contact | null {
    return this.contacts.find(contact => contact.id === id) ?? null;
  }

  addContact(newContact: Contact): void {
    if (!newContact) return;
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(updatedContact: Contact): void {
    const index = this.contacts.findIndex(c => c.id === updatedContact.id);
    if (index !== -1) {
      this.contacts[index] = updatedContact;
      this.storeContacts();
    }
  }

  deleteContact(contact: Contact): void {
    const index = this.contacts.indexOf(contact);
    if (index >= 0) {
      this.contacts.splice(index, 1);
      this.storeContacts();
    }
  }

  private storeContacts(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.contacts.sort((a, b) => a.name.localeCompare(b.name));
    this.http.put(this.firebaseUrl, this.contacts, { headers }).subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice());
    });
  }

  private getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
      const currentId = parseInt(contact.id ?? '0');
      if (!isNaN(currentId) && currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
