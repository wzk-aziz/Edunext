import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Certificate } from 'src/app/models/Certificate';
import { CertificateService } from 'src/app/Services/Certificate_Service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-certificate',
  standalone: true, // ✅ Indique que c'est un standalone component
  imports: [CommonModule,FormsModule],
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {
  certificates: Certificate[] = [];
  filteredCertificates: Certificate[] = [];  // Liste filtrée
  searchTerm: string = '';  // Terme de recherche
  currentPage = 1; // Numéro de page actuel
  itemsPerPage = 5;
  totalPages: number = 0;
  paginatedCertificates: Certificate[] = [];  // Liste des certificats à afficher dans l'interface

  constructor(private certificateService: CertificateService) {}

  ngOnInit(): void {
    this.loadCertificates();
  }

  // Méthode pour charger tous les certificats
  loadCertificates() {
    console.log('Fetching all certificates');
    this.certificateService.getAllCertificate().subscribe({
      next: (data) => {
        console.log('Received certificates:', data); // Vérifier les données récupérées
        this.certificates = data;
        this.filteredCertificates = [...this.certificates]; // Initialiser la liste filtrée avec toutes les données
        this.updatePaginatedCertificates();  // Mettre à jour les certificats paginés après chargement
      },
      error: (err) => console.error('Error loading certificates:', err),
    });
  }

  // Méthode pour changer de page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCertificates();  // Mettre à jour les certificats paginés après changement de page
    }
  }

  // Calculer les numéros de pages
  getPages(): number[] {
    this.totalPages = Math.ceil(this.filteredCertificates.length / this.itemsPerPage);
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Mettre à jour les certificats affichés (pagination)
  updatePaginatedCertificates() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCertificates = this.filteredCertificates.slice(startIndex, endIndex);  // Utiliser filteredCertificates
    console.log('Paginated Certificates:', this.paginatedCertificates);  // Vérifier les certificats paginés
  }

  // Méthode pour filtrer les certificats en fonction du terme de recherche
  onSearchChange(): void {
    console.log('Search term:', this.searchTerm);  // Vérifier le terme de recherche

    if (this.searchTerm.trim() === '') {
      this.filteredCertificates = [...this.certificates];  // Réinitialiser si le terme est vide
    } else {
      // Filtrer les certificats selon le nom du destinataire ou le titre
      this.filteredCertificates = this.certificates.filter((cert) =>
        cert.userFullName!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cert.certificateTitle!.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Réinitialiser la page à 1 après chaque recherche
    this.currentPage = 1;
    this.updatePaginatedCertificates();  // Mettre à jour les certificats paginés après filtrage
  }

  // Fonction pour supprimer un certificat
  deleteCertificate(id: number): void {
    this.certificateService.deleteCertificate(id).subscribe(() => {
      this.loadCertificates();  // Recharger les certificats après suppression
    }, error => {
      console.error('Error deleting certificate:', error);
    });
  }
}
