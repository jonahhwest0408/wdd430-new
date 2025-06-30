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

  private backendUrl = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {
    this.getDocuments();
  }

  getDocuments(): void {
    this.http.get<{ message: string, documents: Document[] }>(this.backendUrl).subscribe(
      (responseData) => {
        this.documents = responseData.documents || [];
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

    newDocument.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string, document: Document }>(this.backendUrl, newDocument, { headers })
      .subscribe((responseData) => {
        this.documents.push(responseData.document);
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) return;

    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(`${this.backendUrl}/${originalDocument.id}`, newDocument, { headers })
      .subscribe(() => {
        this.documents[pos] = newDocument;
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  deleteDocument(document: Document): void {
    if (!document) return;

    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0) return;

    this.http.delete(`${this.backendUrl}/${document.id}`)
      .subscribe(() => {
        this.documents.splice(pos, 1);
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }
}
