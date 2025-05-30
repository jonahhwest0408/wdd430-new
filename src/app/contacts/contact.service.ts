import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contacts.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();

  contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice(); 
  }

  getContact(id: string): Contact | null {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }
  
  addContact(newContact: Contact): void {
    newContact.id = this.generateId();
    this.contacts.push(newContact);
  }

  updateContact(updatedContact: Contact): void {
    const index = this.contacts.findIndex(c => c.id === updatedContact.id);
    if (index !== -1) {
      this.contacts[index] = updatedContact;
    }
  }

  deleteContact(contact: Contact) {
    const index = this.contacts.indexOf(contact);
    if (index < 0) return;
    this.contacts.splice(index, 1);
    this.contactChangedEvent.emit(this.contacts.slice()); // emit updated copy
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
