import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.js';



@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnChanges {
  @Input() pdfUrl: string = '';
  @Input() lectureId: number = 0;
  @Output() scrollProgress = new EventEmitter<number>();
  @ViewChild('pdfContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfUrl'] && this.pdfUrl) {
      this.loadPdf();
    }
  }

  async loadPdf(): Promise<void> {
    const container = this.containerRef.nativeElement;
    container.innerHTML = ''; // Clear previous pages

    const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
    const pdf = await loadingTask.promise;

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.2 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      container.appendChild(canvas);
      await page.render(renderContext).promise;
    }
  }

  onScroll(): void {
    const container = this.containerRef.nativeElement;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const percent = Math.floor((scrollTop / scrollHeight) * 100);

    localStorage.setItem(`lecture_pdf_progress_${this.lectureId}`, percent.toString());
    this.scrollProgress.emit(percent);
  }
}
