import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CertificateService } from 'src/app/Services/Certificate_Service';
import { Chart ,LinearScale,BarElement, CategoryScale, Title, Tooltip, Legend,BarController} from 'chart.js';
@Component({
  selector: 'app-certificattop10',
  templateUrl: './certificattop10.component.html',
  styleUrls: ['./certificattop10.component.css']
})
export class Certificattop10Component {
  isMenuOpen = false;
  topCertificates: any[] = [];
  chart: any;

  isCertificatMenuOpen = false;
  isExamMenuOpen=false;

  toggleExamMenu() {
    this.isExamMenuOpen = !this.isExamMenuOpen;
  }

toggleCertificatMenu() {
  this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
}
 toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  isTeacherMenuOpen = false;

toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
}
   constructor(private certificateService: CertificateService,private router :Router) { }
   
   
    ngOnInit(): void {
  this.certificateService.getTop10Certificates().subscribe(data => {
    this.topCertificates = data;
    this.createChart();
  });
  
}
// Fonction pour créer un graphique avec chart.js
createChart(): void {
  // Enregistrer les composants nécessaires pour Chart.js
  Chart.register(LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend,BarController);

  const ctx = document.getElementById('topCertificatesChart') as HTMLCanvasElement;

  this.chart = new Chart(ctx, {
    type: 'bar', // type de graphique
    data: {
      labels: this.topCertificates.map(cert => cert.title), // Utiliser le titre des certificats
      datasets: [{
        label: 'Certificates Issued',
        data: this.topCertificates.map(cert => cert.count), // Utiliser le nombre de certificats délivrés
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
