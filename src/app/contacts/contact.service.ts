import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contacts.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();


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
    this.contactListChangedEvent.next(this.contacts.slice());
  }
  
  updateContact(updatedContact: Contact): void {
    const index = this.contacts.findIndex(c => c.id === updatedContact.id);
    if (index !== -1) {
      this.contacts[index] = updatedContact;
      this.contactListChangedEvent.next(this.contacts.slice());
    }
  }
  
  deleteContact(contact: Contact): void {
    const index = this.contacts.indexOf(contact);
    if (index >= 0) {
      this.contacts.splice(index, 1);
      this.contactListChangedEvent.next(this.contacts.slice());
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
