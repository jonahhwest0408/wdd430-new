import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ContactService } from '../contact.service';
import { Contact } from '../contacts.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
  standalone: false
})
export class ContactEditComponent implements OnInit {
  originalContact?: Contact;
  contact: Contact = {
    id: '',
    name: '',
    email: '',
    phone: '',
    imageUrl: '',
    group: []
  };  
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id?: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (!this.id) {
        this.editMode = false;
        return;
      }

      const fetchedContact = this.contactService.getContact(this.id);

      if (!fetchedContact) {
        return;
      }

      this.editMode = true;
      this.originalContact = fetchedContact;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.originalContact.group && this.originalContact.group.length > 0) {
        this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (!form.valid || !this.contact) return;

    const value = form.value;
    const newContact: Contact = {
      id: this.contact.id,
      name: value.name,
      email: value.email,
      phone: value.phone,
      imageUrl: value.imageUrl,
      group: this.groupContacts
    };

    if (this.editMode) {
      this.contactService.updateContact(newContact); 
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel(): void {
    this.router.navigate(['/contacts']);
  }

  onRemoveItem(index: number): void {
    if (index < 0 || index >= this.groupContacts.length) {
      return; 
    }
    this.groupContacts.splice(index, 1); 
  }
  
  addToGroup(event: any) {
    const draggedContact = event.dragData;
  
    if (!draggedContact || this.groupContacts.includes(draggedContact)) {
      return;
    }
  
    this.groupContacts.push(draggedContact);
  }
  
  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  isInvalidContact(newContact: Contact): boolean {
    if (!newContact) {
      return true;
    }
  
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
  
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
  
    return false; 
  }
  
}
