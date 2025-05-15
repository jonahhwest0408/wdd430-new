import { Component, Input } from '@angular/core';
import { Contact } from '../contacts.model';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  standalone: false,
})
export class ContactDetailComponent {
  @Input() contact: Contact | null = null;
}
