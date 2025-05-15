import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../documents.model';

@Component({
  selector: 'app-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1', 'Angular Guide', 'Learn Angular step-by-step', 'https://angular.io/guide', []),
    new Document('2', 'TypeScript Handbook', 'Full TS reference', 'https://www.typescriptlang.org/docs', []),
    new Document('3', 'RxJS Docs', 'Reactive Extensions for JS', 'https://rxjs.dev', []),
    new Document('4', 'HTML5 Reference', 'HTML5 full spec', 'https://developer.mozilla.org/en-US/docs/Web/HTML', []),
    new Document('5', 'CSS Tricks', 'CSS Tips & Tricks', 'https://css-tricks.com', [])
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
