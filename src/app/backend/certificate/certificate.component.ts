import { Component, ViewChild } from '@angular/core';
import { Certificate } from 'src/app/models/Certificate';
import { CertificateService } from 'src/app/Services/Certificate_Service';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {
  isMenuOpen = false;
searchTerm: string="";
  

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
 // newCertificate: Certificate = new Certificate('', '', '', '');
 @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private certificateService: CertificateService) { }
 
 
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
        cert.recipientName!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cert.title!.toLowerCase().includes(this.searchTerm.toLowerCase())
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

  filteredcert() {
    return this.certificates.filter(cert => {
      return cert.recipientName!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      cert.title!.toLowerCase().includes(this.searchTerm.toLowerCase());
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
 


  downloadCertificate(id: number) {
    this.certificateService.downloadCertificate(id).subscribe(async (response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const arrayBuffer = await blob.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
  
      // Ajouter le fond du certificat avec taille A4
      const backgroundUrl = '/assets/images/backg.png'; 
      const backgroundBytes = await fetch(backgroundUrl).then(res => res.arrayBuffer());
      const backgroundImage = await pdfDoc.embedPng(backgroundBytes);
      
      // Taille de la page A4 (595x842 points)
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();
      
      // Réduire la taille de la page (par exemple, passer à une taille plus petite)
      
      const newWidth = width ;
      const newHeight = height ;
  
      // Redimensionner l'image de fond
      page.drawImage(backgroundImage, {
        x: 0,
        y: 0,
        width: newWidth,
        height: newHeight,
      });
  
      // Ajouter le logo à droite
      const logoUrl = '/assets/images/logo.png';
      const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
      const logoImage = await pdfDoc.embedPng(logoBytes);
  
      // Positionner le logo à droite (ajustez x pour un meilleur placement)
      page.drawImage(logoImage, {
        x: newWidth - 120,  // Placer à droite, 120px du bord droit
        y: newHeight - 150,
        width: 100,
        height: 100,
      });
  
      // Ajouter les textes stylés
      const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      const titleFontSize = 30;
      const textFontSize = 18;
  
      page.drawText('CERTIFICAT DE RÉUSSITE', {
        x: newWidth / 2 - font.widthOfTextAtSize('CERTIFICAT DE RÉUSSITE', titleFontSize) / 2,
        y: newHeight - 280,
        size: titleFontSize,
        font,
      });
  
      page.drawText(`ID de l'examen : ${id}`, {
        x: newWidth / 2 - font.widthOfTextAtSize(`ID de l'examen : ${id}`, textFontSize) / 2,
        y: newHeight - 330,
        size: textFontSize,
        font,
      });
  
      page.drawText(`Date d'émission : ${new Date().toLocaleDateString()}`, {
        x: newWidth / 2 - font.widthOfTextAtSize(`Date d'émission : ${new Date().toLocaleDateString()}`, textFontSize) / 2,
        y: newHeight - 470,
        size: textFontSize,
        font,
      });
  
      // Ajouter la signature et réduire sa taille
      const signatureUrl = '/assets/images/sign.png'; 
      const signatureBytes = await fetch(signatureUrl).then(res => res.arrayBuffer());
      const signatureImage = await pdfDoc.embedPng(signatureBytes);
  
      // Réduire la taille de la signature
      page.drawImage(signatureImage, {
        x: newWidth / 2 - 50,
        y: 150,
        width: 200,  // Taille réduite pour la signature
        height: 110,  // Taille réduite pour la signature
      });
  
      // Générer et télécharger le PDF
      const pdfBytes = await pdfDoc.save();
      const modifiedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(modifiedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
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




