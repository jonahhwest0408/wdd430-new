import { Component } from '@angular/core';
import { Document } from './documents.model';

@Component({
  selector: 'app-documents',
  standalone: false,
  templateUrl: './documents.component.html',
})
export class DocumentsComponent {
  selectedDocument?: Document;

  onSelectedDocument(document: Document) {
    this.selectedDocument = document;
  }
}
