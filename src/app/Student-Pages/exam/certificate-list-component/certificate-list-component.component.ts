import { Component } from '@angular/core';
import { Certificate } from 'src/app/models/Certificate';
import { AuthenticationServiceService } from 'src/app/Services/authentication-service.service';
import { CertificateService } from 'src/app/Services/Certificate_Service';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-certificate-list-component',
  templateUrl: './certificate-list-component.component.html',
  styleUrls: ['./certificate-list-component.component.css']
})
export class CertificateListComponentComponent {
  certificates: Certificate[] = [];
  paginatedCertificates: Certificate[] = [];
  userId?: number;
  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  downloadedCount = 0;
  constructor(
    private certificateService: CertificateService,
    private authService: AuthenticationServiceService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() ?? 0;
    console.log("User ID:", this.userId);
    this.getCertificates();
  }

  // Appel à la méthode du service pour récupérer les certificats
  getCertificates(): void {
    this.certificateService.getCertificatesByUser(this.userId!).subscribe(
      (data) => {
        console.log('Données reçues :', data);
        this.certificates = data; // Récupérer les données et les stocker dans le tableau
        this.updatePagination(); 
      },
      (error) => {
        console.error('Il y a eu une erreur:', error); // Gérer l'erreur
      }
    );
  }
  
// Mise à jour de la pagination
updatePagination(): void {
  this.totalPages = Math.ceil(this.certificates.length / this.itemsPerPage);
  this.paginatedCertificates = this.certificates.slice(
    (this.currentPage - 1) * this.itemsPerPage,
    this.currentPage * this.itemsPerPage
  );
}

changePage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.updatePagination();
  }
}

getPages(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}
onSearchChange(): void {
  const filtered = this.certificates.filter(cert =>
    cert.certificateTitle?.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
  this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
  this.paginatedCertificates = filtered.slice(0, this.itemsPerPage);
  this.currentPage = 1;
}
  generatePDF(certificate: Certificate): void {
    const doc = new jsPDF('landscape', 'pt', 'a4'); // Format A4 paysage
  
    // Charger l'image de fond
    const backgroundUrl = '/assets/images/backg.png';
    const logoUrl = '/assets/images/logooo.png';
    const signatureUrl = '/assets/images/signn.png';
  
    // Ajouter le fond
    doc.addImage(backgroundUrl, 'PNG', 0, 0, 842, 595); // Taille de la page A4 paysage
  
  // Ajouter le logo en haut à droite
  doc.addImage(logoUrl, 'PNG', 692, 50, 100, 100); // Placer à droite en haut

  
    // Ajouter le titre
    doc.setFontSize(30);
    doc.setFont('times', 'bold');
    doc.text('CERTIFICAT DE RÉUSSITE', 421, 250, { align: 'center' });
  
    // Ajouter les informations du certificat
    doc.setFontSize(18);
    doc.setFont('times', 'normal');
  
    // Nom de l'utilisateur
    doc.text(`Nom de l'utilisateur: ${certificate.userFullName}`, 421, 298, { align: 'center' });
    
    
  
    // Date d'émission
    doc.text(`Date d'émission: ${certificate.issuedDate}`, 421, 350, { align: 'center' });
  
    // Ajouter la signature
    doc.addImage(signatureUrl, 'PNG', 522, 350, 220, 110); // Signature en bas à droite
  
    // Sauvegarder et télécharger le PDF
    doc.save(`Certificat_${certificate.userFullName}_${certificate.certificateTitle}.pdf`);
    this.downloadedCount++;
  }
  

}
