import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { exam } from 'src/app/models/exam';
import { Question } from 'src/app/models/Question';
import { ExamService } from 'src/app/Services/exam_service';


@Component({
  selector: 'app-exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.css']
})
export class ExamEditComponent implements OnInit {
  exam: exam = new exam();

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idExam = Number(this.route.snapshot.paramMap.get('idExam'));
  
    if (!isNaN(idExam) && idExam > 0) {
      this.examService.getExamById(idExam).subscribe({
        next: (exam) => {
          if (exam.scheduledDate) {
            const date = new Date(exam.scheduledDate);
            exam.scheduledDate = date.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
          }
          // Initialize questions array if it is not already
          exam.questions = exam.questions || [];
          this.exam = exam;
        },
        error: (err) => console.error(`❌ Error fetching exam [ID: ${idExam}] :`, err)
      });
    } else {
      console.error(`⚠️ Invalid exam ID: ${idExam}`);
    }
  }
  

  addQuestion(): void {
    if (!this.exam.questions) {
      this.exam.questions = [];
    }
    const newQuestion: Question = {
      id: Date.now(), // Generate unique ID (could be improved)
      questionText: '',
      answerOptions: ''
    };
    this.exam.questions.push(newQuestion);
  }
  

  onSubmit(): void {
    this.examService.updateExam(this.exam.idExam!, this.exam).subscribe(() => {
      this.router.navigate(['/examlist']);  // Rediriger vers la liste des examens après la modification
    });
  }
  onUpdate() {
    this.examService.updateExam(this.exam.idExam!, this.exam).subscribe(() => {
      this.router.navigate(['/examlist']);
    });
  }

  onQuestionUpdate(question: Question) {
    this.examService.updateQuestion(question.id!, question).subscribe();
  }
  
}