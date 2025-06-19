import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contacts.model';


@Pipe({
  name: 'contactsFilter',
  standalone: false
})

export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], term: string): Contact[] {
    if (!term) return contacts;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(term.toLowerCase())
    );
  }
}
