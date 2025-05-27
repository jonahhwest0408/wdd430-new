import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Document } from '../documents.model';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css'],
  standalone: false
})
export class DocumentItemComponent {
  @Input() document!: Document;
  @Output() documentSelected = new EventEmitter<Document>();

  onClick() {
    this.documentSelected.emit(this.document);
  }
}
