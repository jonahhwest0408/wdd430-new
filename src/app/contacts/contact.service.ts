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

  private backendUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  getContacts(): void {
    this.http.get<{ message: string, contacts: Contact[] }>(this.backendUrl).subscribe(
      (response) => {
        this.contacts = response.contacts || [];
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

    newContact.id = ''; // backend assigns id

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, contact: Contact }>(this.backendUrl, newContact, { headers }).subscribe(
      (response) => {
        this.contacts.push(response.contact);
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error) => {
        console.error('Error adding contact:', error);
      }
    );
  }

  updateContact(updatedContact: Contact): void {
    if (!updatedContact) return;

    const pos = this.contacts.findIndex(c => c.id === updatedContact.id);
    if (pos < 0) return;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(this.backendUrl + '/' + updatedContact.id, updatedContact, { headers }).subscribe(
      () => {
        this.contacts[pos] = updatedContact;
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error) => {
        console.error('Error updating contact:', error);
      }
    );
  }

  deleteContact(contact: Contact): void {
    if (!contact) return;

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) return;

    this.http.delete(this.backendUrl + '/' + contact.id).subscribe(
      () => {
        this.contacts.splice(pos, 1);
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error) => {
        console.error('Error deleting contact:', error);
      }
    );
  }
}
