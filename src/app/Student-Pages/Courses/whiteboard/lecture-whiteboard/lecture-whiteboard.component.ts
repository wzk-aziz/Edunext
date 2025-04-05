import { Component, ElementRef, ViewChild } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

interface TextBox {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
}

@Component({
  selector: 'app-lecture-whiteboard',
  templateUrl: './lecture-whiteboard.component.html',
  styleUrls: ['./lecture-whiteboard.component.css']
})
export class LectureWhiteboardComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;

  mode: 'cursor' | 'pen' | 'eraser' | 'text' = 'pen';
  color = '#000000';
  lineWidth = 2;
  fontSize = 18;
  fontFamily = 'Arial';

  textBoxes: TextBox[] = [];
  lockedTextBoxes: TextBox[] = [];

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineCap = 'round';
  }

  handleCanvasClick(event: MouseEvent): void {
    if (this.mode !== 'text') return;
  
    const canvas = this.canvasRef.nativeElement;
    const canvasRect = canvas.getBoundingClientRect();
  
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;
  
    this.textBoxes.push({
      x,
      y,
      text: '',
      fontSize: this.fontSize,
      fontFamily: this.fontFamily
    });
  
    this.redrawCanvas(); // Optional live preview
  }
  

  autoRenderTextBox(index: number): void {
    // Optional: used for future text syncing or autosave logic
  }

  liveRenderTextBox(_: number): void {
    this.redrawCanvas();
  }

  startDrawing(event: MouseEvent): void {
    if (this.mode !== 'pen' && this.mode !== 'eraser') return;

    const x = event.offsetX;
    const y = event.offsetY;

    this.isDrawing = true;
    this.ctx.strokeStyle = this.mode === 'eraser' ? '#ffffff' : this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  draw(event: MouseEvent): void {
    if (!this.isDrawing || (this.mode !== 'pen' && this.mode !== 'eraser')) return;
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
  }

  stopDrawing(): void {
    if (this.isDrawing) {
      this.ctx.closePath();
      this.isDrawing = false;
    }
  }

  onDragEnd(event: any, index: number): void {
    const canvas = this.canvasRef.nativeElement;
  
    const newX = Math.max(0, Math.min(event.source.getFreeDragPosition().x, canvas.width - 150)); // prevent overflow
    const newY = Math.max(0, Math.min(event.source.getFreeDragPosition().y, canvas.height - 60));
  
    this.textBoxes[index].x = newX;
    this.textBoxes[index].y = newY;
  
    this.redrawCanvas();
  }
  
  onRightClick(event: MouseEvent, index: number): void {
    event.preventDefault();

    if (confirm('Delete this text box?')) {
      this.textBoxes.splice(index, 1);
      this.redrawCanvas();
    }
  }

  lockTextBox(index: number): void {
    const box = this.textBoxes[index];

    // Add to locked array
    this.lockedTextBoxes.push({ ...box });

    // Remove from editable text box array
    this.textBoxes.splice(index, 1);

    this.redrawCanvas();
  }

  redrawCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw locked boxes
    this.lockedTextBoxes.forEach((box) => {
      if (!box.text.trim()) return;

      const lines = box.text.split('\n');
      this.ctx.font = `${box.fontSize}px ${box.fontFamily}`;
      this.ctx.fillStyle = this.color;

      lines.forEach((line, i) => {
        this.ctx.fillText(line, box.x, box.y + i * (box.fontSize + 4));
      });
    });

    // Draw preview of live editable boxes
    this.textBoxes.forEach((box) => {
      if (!box.text.trim()) return;

      const lines = box.text.split('\n');
      this.ctx.font = `${box.fontSize}px ${box.fontFamily}`;
      this.ctx.fillStyle = this.color;

      lines.forEach((line, i) => {
        this.ctx.fillText(line, box.x, box.y + i * (box.fontSize + 4));
      });
    });
  }

  clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.textBoxes = [];
    this.lockedTextBoxes = [];
  }

  saveImage(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;

    // Redraw everything onto the canvas
    this.redrawCanvas();

    // Export
    const link = document.createElement('a');
    link.download = `whiteboard_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}
