import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Document } from './documents.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  private maxDocumentId: number = 0;

  documentListChangedEvent = new Subject<Document[]>();

  private firebaseUrl = 'https://wdd430-9af8f-default-rtdb.firebaseio.com/documents.json';

  constructor(private http: HttpClient) {
    this.getDocuments();
  }

  getDocuments(): void {
    this.http.get<Document[]>(this.firebaseUrl).subscribe(
      (documents: Document[]) => {
        this.documents = documents || [];
        this.maxDocumentId = this.getMaxId();

        this.documents.sort((a, b) => a.name.localeCompare(b.name));

        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.error('Failed to fetch documents:', error);
      }
    );
  }

  getDocument(id: string): Document | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
      const currentId = parseInt(document.id ?? '0');
      if (!isNaN(currentId) && currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }  

  addDocument(newDocument: Document): void {
    if (!newDocument) return;

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) return;

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document): void {
    if (!document) return;

    const pos = this.documents.indexOf(document);
    if (pos < 0) return;

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

  private storeDocuments(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(this.firebaseUrl, this.documents, { headers }).subscribe(() => {
      this.documentListChangedEvent.next(this.documents.slice());
    });
  }
}
