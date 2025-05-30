import { Injectable } from '@angular/core';
import { Document } from './documents.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];

  documentChangedEvent = new EventEmitter<Document[]>();

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments(): Document[] {
    return this.documents.slice(); 
  }

  getDocument(id: string): Document | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  deleteDocument(document: Document): void {
    if (!document) return;
  
    const pos = this.documents.indexOf(document);
    if (pos < 0) return;
  
    this.documents.splice(pos, 1);
    this.documentChangedEvent.emit(this.documents.slice()); 
  }
  
}
