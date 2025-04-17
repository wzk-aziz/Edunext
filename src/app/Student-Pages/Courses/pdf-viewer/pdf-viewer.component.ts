import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

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

  pdf!: PDFDocumentProxy;
  pages: number[] = [];
  loading: boolean = false;
  bookmarks: { id: number, scrollTop: number, label: string }[] = [];
  editingBookmarkId: number | null = null;
  quizQuestions: any[] = [];
  showQuiz: boolean = false;
  quizFetched: boolean = false;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfUrl'] && this.pdfUrl) {
      this.loadPdf();
    }
  }

  async loadPdf() {
    if (!this.pdfUrl || !this.lectureId) return;

    this.loading = true;
    try {
      const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
      this.pdf = await loadingTask.promise;

      this.pages = Array.from({ length: this.pdf.numPages }, (_, i) => i + 1);
      this.loadBookmarks(); // Load bookmarks after rendering

      for (let i = 1; i <= this.pdf.numPages; i++) {
        const page = await this.pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.getElementById(`page_${i}`) as HTMLCanvasElement;
        if (canvas) {
          const context = canvas.getContext('2d')!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
        }
      }

      // ✅ Restore scroll position
      setTimeout(() => {
        const scrollKey = `lecture_pdf_scroll_${this.lectureId}`;
        const savedScroll = parseInt(localStorage.getItem(scrollKey) || '0', 10);
        if (this.containerRef?.nativeElement) {
          this.containerRef.nativeElement.scrollTop = savedScroll;
          console.log('📄 Restored PDF scroll to:', savedScroll);
        }
      }, 200);
    } catch (error) {
      console.error('❌ Failed to load PDF:', error);
    } finally {
      this.loading = false;
    }
  }

  onScroll(): void {
    const container = this.containerRef.nativeElement;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const percent = Math.floor((scrollTop / scrollHeight) * 100);

    // Save progress and scrollTop
    localStorage.setItem(`lecture_pdf_progress_${this.lectureId}`, percent.toString());
    localStorage.setItem(`lecture_pdf_scroll_${this.lectureId}`, scrollTop.toString());

    this.scrollProgress.emit(percent);
    
  }

  addBookmark(): void {
    const scrollTop = this.containerRef.nativeElement.scrollTop;
    const label = `Bookmark ${this.bookmarks.length + 1}`;
    const bookmark = { id: Date.now(), scrollTop, label };
  
    this.bookmarks.push(bookmark);
    this.saveBookmarks();
  }
  
  goToBookmark(scrollTop: number): void {
    this.containerRef.nativeElement.scrollTop = scrollTop;
  }
  
  removeBookmark(id: number): void {
    this.bookmarks = this.bookmarks.filter(b => b.id !== id);
    this.saveBookmarks();
  }
  
  private saveBookmarks(): void {
    const key = `lecture_pdf_bookmarks_${this.lectureId}`;
    localStorage.setItem(key, JSON.stringify(this.bookmarks));
  }
  
  private loadBookmarks(): void {
    const key = `lecture_pdf_bookmarks_${this.lectureId}`;
    const data = localStorage.getItem(key);
    this.bookmarks = data ? JSON.parse(data) : [];
  }

  startEditing(id: number): void {
    this.editingBookmarkId = id;
  }
  
  finishEditing(bookmark: any, newLabel: string): void {
    bookmark.label = newLabel.trim() || bookmark.label;
    this.editingBookmarkId = null;
    this.saveBookmarks();
  }
  
  
}
