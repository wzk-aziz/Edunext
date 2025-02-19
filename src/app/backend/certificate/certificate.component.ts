import { Component } from '@angular/core';
import { Certificate } from 'src/app/models/Certificate';
import { CertificateService } from 'src/app/Services/Certificate_Service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
}

  certificates: Certificate[] = [];
  selectedCertificate: Certificate | null = null;
 // newCertificate: Certificate = new Certificate('', '', '', '');

  constructor(private certificateService: CertificateService) { }
 

  
  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates() {
    console.log('Fetching all certificates');
    this.certificateService.getAllCertificate().subscribe({
      next: (data) => {
        console.log('Received certificates:', data);  // Vérifie les données
        this.certificates = data;
      },
      error: (err) => console.error('Error loading certificates:', err)
    });
  }
  updateCertificate(cert: Certificate) {
    this.selectedCertificate = { ...cert }; // Copier les données pour éviter les changements directs
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

  // ❌ Supprimer un certificat
  deleteCertificate(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce certificat ?')) {
      this.certificateService.deleteCertificate(id).subscribe(() => {
        this.certificates = this.certificates.filter(cert => cert.id !== id);
      });
    }
  }
  //loadCertificates(): void {
   // this.certificateService.getCertificates().subscribe(certificates => {
   //   this.certificates = certificates;
   // });
  //}

 // addCertificate(): void {
   // this.certificateService.createCertificate(this.newCertificate).subscribe(certificate => {
  //    this.certificates.push(certificate);
   //   this.newCertificate = new Certificate('', '', '', '');
  //  });
  }

 // editCertificate(certificate: Certificate): void {
    // Open a modal or navigate to an edit page with the selected certificate data
  //}

 // deleteCertificate(id: number): void {
  //  this.certificateService.deleteCertificate(id).subscribe(() => {
   //   this.certificates = this.certificates.filter(cert => cert.id !== id);
  //  });
 // }


