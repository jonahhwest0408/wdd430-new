import { Component, Input } from '@angular/core';
import { Document } from '../documents.model';

@Component({
  selector: 'app-document-detail',
  standalone: false,
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css'
})
export class DocumentDetailComponent {
  @Input() document!: Document;
}
