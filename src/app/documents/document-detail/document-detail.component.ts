import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Document } from '../documents.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css'],
  standalone: false
})
export class DocumentDetailComponent implements OnInit {
  document!: Document;
  nativeWindow: any;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private windRefService: WindRefService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nativeWindow = this.windRefService.getNativeWindow(); 

    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      const foundDoc = this.documentService.getDocument(id);
      if (foundDoc) {
        this.document = foundDoc;
      }
    });
  }

  onView(): void {
    if (this.document && this.document.url) {
      console.log("Opening URL:", this.document.url);
      this.nativeWindow.open(this.document.url);
    } else {
      console.warn("Document or URL is missing");
    }
  }

  onDelete(): void {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }
  
}
