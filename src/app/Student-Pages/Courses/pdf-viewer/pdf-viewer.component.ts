import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { Lecture } from 'src/app/model/Lecture.model';
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
  loading = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfUrl'] && this.pdfUrl) {
      this.loadPdf(
        
      );
    }
  }

  

  async loadPdf(): Promise<void> {
    this.loading = true; // ✅ Start loading spinner
  
    const container = this.containerRef.nativeElement;
    container.innerHTML = '';
  
    const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
    const pdf = await loadingTask.promise;
  
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.2 });
  
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      await page.render({ canvasContext: context, viewport }).promise;
      container.appendChild(canvas);
    }
  
    this.loading = false; // ✅ Done loading spinner
  }
  

  onScroll(): void {
    const container = this.containerRef.nativeElement;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const percent = Math.floor((scrollTop / scrollHeight) * 100);

    this.scrollProgress.emit(percent); // 💥 Emits actual scroll %
  }
}
