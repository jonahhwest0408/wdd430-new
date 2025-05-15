import { Component, EventEmitter, Output } from '@angular/core';
import { Contact } from '../contacts.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  standalone: false
})
export class ContactListComponent {
  @Output() selectedContactEvent = new EventEmitter<Contact>();

  contacts: Contact[] = [
    new Contact('1', 'R. Kent Jackson', 'jacksonk@byui.edu', '208-496-3771', 'images/jacksonk.jpg', []),
    new Contact('2', 'Rex Barzee', 'barzeer@byui.edu', '208-496-3768', 'images/barzeer.jpg', []),
  ];

  onSelected(contact: Contact) {
    console.log('Selected contact:', contact);  // Debug log
    this.selectedContactEvent.emit(contact); 
  }
}
