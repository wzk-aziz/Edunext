import { Component, Input } from '@angular/core';
import { exam } from 'src/app/models/exam';
import { ExamService } from 'src/app/Services/exam_service';

@Component({
  selector: 'app-examstudentdetails',
  templateUrl: './examstudentdetails.component.html',
  styleUrls: ['./examstudentdetails.component.css']
})
export class ExamstudentdetailsComponent {
  @Input() examId!: number;
  exam?: exam;

  constructor(private examService: ExamService) {}

  ngOnChanges(): void {
    if (this.examId) {
      this.examService.getExamById(this.examId).subscribe({
        next: (data) => this.exam = data,
        error: (err) => console.error('Erreur chargement examen', err)
      });
    }
  }

}
