import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ExamService } from 'src/app/Services/exam_service';
import { Chart, LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend, BarController } from 'chart.js';

@Component({
  selector: 'app-examstop10',
  templateUrl: './examstop10.component.html',
  styleUrls: ['./examstop10.component.css']
})
export class Examstop10Component implements OnInit {
  isMenuOpen = false;
  topExams: any[] = [];
  chart: any;
  isCertificatMenuOpen = false;
  isTeacherMenuOpen = false;
  isExamMenuOpen=false;
  totalSubmissions = 0; // Variable pour stocker le nombre total de soumissions
  total = 0; // Variable pour stocker le nombre total d'examens
  scoreComparison: any = {};
 
  constructor(private examService: ExamService) { }
  ngOnInit(): void {
    this.examService.getTop10Exams().subscribe(data => {
      console.log('Données reçues:', data);
      this.topExams = data;
      this.topExams = this.topExams.filter((exam, index, self) =>
        index === self.findIndex((e) => e.exam.examTitle === exam.exam.examTitle)
      );
      
      if (this.topExams.length > 0) {
        console.log('Exams:', this.topExams);  
        
        // Attendre la mise à jour de la vue avant de créer le graphique
        setTimeout(() => {
          this.createChart();
        }, 0);
      } else {
        console.error('Aucun examen à afficher');
      }
    }, error => {
      console.error('Erreur lors de la récupération des données:', error);
    });
    
   // Appeler le service pour obtenir le nombre total de soumissions
   this.examService.getTotalExamSubmissions().subscribe(
    (data: number) => {
      this.totalSubmissions = data;
      console.log('Nombre total de soumissions:', this.totalSubmissions);
    },
    error => {
      console.error('Erreur lors de la récupération du nombre de soumissions:', error);
    }
  );

 // Appeler le service pour obtenir le nombre total de soumissions
 this.examService.gettotalExams().subscribe(
  (data: number) => {
    this.total = data;
    console.log('Nombre total :', this.total);
  },
  error => {
    console.error('Erreur lors de la récupération du nombre exam:', error);
  }
);

this.loadScoreComparison();
  }
  loadScoreComparison(): void {
    this.examService.getcomparaissonscore().subscribe(data => {
      this.scoreComparison = data;
    });
  }
  

    toggleCertificatMenu() {
    this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
  }

  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleExamMenu() {
    this.isExamMenuOpen = !this.isExamMenuOpen;
  }

  createChart(): void {
    // Enregistrer les composants nécessaires pour Chart.js
    Chart.register(LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend, BarController);

    const ctx = document.getElementById('topExamsChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element not found!');
      return;
    }

    // Créer le graphique
    this.chart = new Chart(ctx, {
      type: 'bar', // Type de graphique
      data: {
        labels: this.topExams.map(exam => exam.exam.examTitle), // Utiliser le titre des examens
        datasets: [{
          label: 'Scores',
          data: this.topExams.map(exam => exam.score), // Utiliser le score des examens
          backgroundColor: 'rgba(0,123,255,0.6)',
          borderColor: 'rgba(0,123,255,1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  isDarkMode = false;

toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
}
// Variable pour savoir si la sidebar est réduite
isSidebarMini = false;

// Fonction pour basculer l'état de la sidebar
toggleSidebar() {
  this.isSidebarMini = !this.isSidebarMini;
}
}
