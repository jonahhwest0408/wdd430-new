import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../documents.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  standalone: false
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  subscription!: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      (documents: Document[]) => {
        this.documents = documents;
      }
    );

    this.documentService.getDocuments();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
