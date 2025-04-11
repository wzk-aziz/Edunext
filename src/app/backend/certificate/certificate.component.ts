import { Component, ViewChild } from '@angular/core';
import { Certificate } from 'src/app/models/Certificate';
import { CertificateService } from 'src/app/Services/Certificate_Service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {
  isMenuOpen = false;
searchTerm: string="";
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

  certificates: Certificate[] = [];
  filteredCertificates: Certificate[] = [];
  selectedCertificate: Certificate | null = null;
  displayedColumns: string[] = ['issueDate', 'recipientName', 'title', 'actions'];
  dataSource = new MatTableDataSource<Certificate>();

  currentPage = 1;
  itemsPerPage = 6; 
  topCertificates: any[] = [];

 @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private certificateService: CertificateService,private router :Router) { }
 
 
  ngOnInit(): void {

    this.loadCertificates();
   
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  loadCertificates() {
    console.log('Fetching all certificates');
    this.certificateService.getAllCertificate().subscribe({
      next: (data) => {
        console.log('Received certificates:', data);  // Vérifie les données
        this.certificates = data;
        this.dataSource.data = data;
        this.filteredCertificates = [...this.certificates];
      
      },
      error: (err) => console.error('Error loading certificates:', err)
    });
  }
  onSearchChange(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredCertificates = [...this.certificates];
    } else {
      this.filteredCertificates = this.certificates.filter(cert =>
        cert.userFullName!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cert.certificateTitle!.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
  }

  get paginatedExams() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCertificates.slice(start, start + this.itemsPerPage);
  }
  get totalPages() {
    return Math.ceil(this.filteredCertificates.length / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }}
    // ❌ Supprimer un certificat
    deleteCertificate(id: number) {
      if (confirm('Voulez-vous vraiment supprimer ce certificat ?')) {
        this.certificateService.deleteCertificate(id).subscribe(() => {
          this.certificates = this.certificates.filter(cert => cert.id !== id);
          this.dataSource.data = [...this.certificates];
        });
      }
    }
   
  updateCertificate(cert: Certificate) {
    this.selectedCertificate = { ...cert }; // Copier les données pour éviter les changements directs
  }
  navigateToUpdatePage(id: number): void {
    this.router.navigate(['/certificate-listcomponent', id]);
  }

  filteredcert() {
    return this.certificates.filter(cert => {
      return cert.userFullName!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      cert.certificateTitle!.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  saveCertificate() {
    if (this.selectedCertificate) {
      this.certificateService.updateCertificate(this.selectedCertificate.id!, this.selectedCertificate)
        .subscribe(() => {
          this.loadCertificates();
          this.selectedCertificate = null;
        });
    }
  }
 

  

  generatePDF(certificate: Certificate): void {
    const doc = new jsPDF('landscape', 'pt', 'a4'); // Format A4 paysage
  
    // Charger l'image de fond
    const backgroundUrl = '/assets/images/backg.png';
    const logoUrl = '/assets/images/logooo.png';
    const signatureUrl = '/assets/images/signn.png';
  
    // Ajouter le fond
    doc.addImage(backgroundUrl, 'PNG', 0, 0, 842, 595); // Taille de la page A4 paysage
  
    // Ajouter le logo
    doc.addImage(logoUrl, 'PNG', 595 - 100 + 150, 20, 100, 100); // Placer à droite en haut
  
    // Ajouter le titre
    doc.setFontSize(30);
    doc.setFont('times', 'bold');
    doc.text('CERTIFICAT DE RÉUSSITE', 421, 250, { align: 'center' });
  
    // Ajouter les informations du certificat
    doc.setFontSize(18);
    doc.setFont('times', 'normal');
  
    // Nom de l'utilisateur
    doc.text(`Nom de l'utilisateur: ${certificate.userFullName}`, 421, 300, { align: 'center' });
    
    
  
    // Date d'émission
    doc.text(`Date d'émission: ${certificate.issuedDate}`, 421, 380, { align: 'center' });
  
    // Ajouter la signature
    doc.addImage(signatureUrl, 'PNG', 542, 380, 200, 110); // Signature en bas à droite
  
    // Sauvegarder et télécharger le PDF
    doc.save(`Certificat_${certificate.userFullName}_${certificate.certificateTitle}.pdf`);
  }
  

// Cette fonction peut être utilisée pour récupérer les données dynamiques du certificat
getCertificateData(id: number): any {
  // Exemple de données retournées par le backend (vous pouvez les adapter selon vos besoins)
  return {
    recipientName: 'John Doe',  // Nom du destinataire
    examId: id,                 // ID de l'examen
    issueDate: new Date().toLocaleDateString(),  // Date d'émission
  };
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

  
 // addCertificate(): void {
   // this.certificateService.createCertificate(this.newCertificate).subscribe(certificate => {
  //    this.certificates.push(certificate);
   //   this.newCertificate = new Certificate('', '', '', '');
  //  });
  }

 // editCertificate(certificate: Certificate): void {
    // Open a modal or navigate to an edit page with the selected certificate data
  //}




