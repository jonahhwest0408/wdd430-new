import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../contact.service';
import { Contact } from '../contacts.model';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
  standalone: false
})
export class ContactEditComponent implements OnInit {
  contact: Contact = this.createEmptyContact();
  isNewContact: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isNewContact = true;
        const existingContact = this.contactService.getContact(id);
        if (existingContact) {
          this.contact = { ...existingContact }; 
        } else {
          this.router.navigate(['/contacts']);
        }
      } else {
        this.isNewContact = false;
        this.contact = this.createEmptyContact();
      }
    });
  }

  createEmptyContact(): Contact {
    return {
      id: '',
      name: '',
      email: '',
      phone: '',
      imageUrl: '',
      group: []
    };
  }

  onSave(): void {
    if (this.isNewContact) {
      this.contactService.updateContact(this.contact);
    } else {
      this.contactService.addContact(this.contact);
    }
    this.router.navigate(['/contacts', this.contact.id]);
  }

  onCancel(): void {
    if (this.isNewContact) {
      this.router.navigate(['/contacts', this.contact.id]);
    } else {
      this.router.navigate(['/contacts']);
    }
  }
}
