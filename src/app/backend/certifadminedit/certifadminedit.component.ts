import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Certificate } from 'src/app/models/Certificate';
import { CertificateService } from 'src/app/Services/Certificate_Service';

@Component({
  selector: 'app-certifadminedit',
  templateUrl: './certifadminedit.component.html',
  styleUrls: ['./certifadminedit.component.css']
})
export class CertifadmineditComponent implements OnChanges {
  @Input() idExam!: number;
  certificates: Certificate[] = [];
  newCertificate: Certificate = {
    title: '',
    recipientName: '',
    issueDate: new Date().toISOString().split('T')[0],
    idExam: 0 // On initialise à 0 et on le met à jour plus tard
  };

  constructor(private certificateService: CertificateService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idExam'] && this.idExam) {
      console.log('idExam received:', this.idExam);
      this.loadCertificates();
      this.newCertificate.idExam = this.idExam; // Mettre à jour l'ID
    }
  }

  // Charger les certificats pour un examen spécifique
  loadCertificates() {
    console.log('Fetching certificates for exam ID:', this.idExam);
    this.certificateService.getCertificatesByExam(this.idExam).subscribe({
      next: (data) => {
        console.log('Received certificates:', data); // Vérifier les données reçues
        this.certificates = data;
      },
      error: (err) => console.error('Error loading certificates:', err) // Gérer les erreurs
    });
  }

  // Créer un nouveau certificat
  onCreate() {
    this.certificateService.createCertificate(this.idExam, this.newCertificate)
      .subscribe(() => {
        this.loadCertificates();  // Recharger les certificats
        this.newCertificate = { 
          title: '', 
          recipientName: '', 
          issueDate: new Date().toISOString().split('T')[0],
          idExam: this.idExam
        };
      });
  }
}
