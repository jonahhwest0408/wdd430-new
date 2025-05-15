import { Component } from '@angular/core';
import { Contact } from './contacts.model';

@Component({
  selector: 'app-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
})
export class ContactsComponent {
  selectedContact: Contact | null = null;  

  onContactSelected(contact: Contact) {
    this.selectedContact = contact; 
  }
}
