import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Certificate } from 'src/app/models/Certificate';
import { CertificateService } from 'src/app/Services/Certificate_Service';

@Component({
  selector: 'app-certificate',
  standalone: true, // ✅ Indique que c'est un standalone component
  imports: [CommonModule],
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {
 certificates: Certificate[] = [];
 // newCertificate: Certificate = new Certificate('', '', '', '');

  constructor(private certificateService: CertificateService) { }
 

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
  
  ngOnInit(): void {
    this.loadCertificates();
  }
}
