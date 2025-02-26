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
 filteredCertificates: Certificate[] = [];
 searchTerm: string = '';  // Variable for search term
  currentPage = 1; // Default page number
  itemsPerPage = 5;

  get paginatedExams() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCertificates.slice(start, start + this.itemsPerPage);
  }
  
get totalPages() {
  return Math.ceil(this.certificates.length / this.itemsPerPage);
}

// Method to handle page changes
onPageChange(page: number): void {
  if (page < 1) {
    page = 1;  // Prevent going below page 1
  } else if (page > this.totalPages) {
    page = this.totalPages;  // Prevent going above the last page
  }
  this.currentPage = page;
}
 // newCertificate: Certificate = new Certificate('', '', '', '');

  constructor(private certificateService: CertificateService) { }
 

  loadCertificates() {
    console.log('Fetching all certificates');
    this.certificateService.getAllCertificate().subscribe({
      next: (data) => {
        console.log('Received certificates:', data);  // Vérifie les données
        this.certificates = data;
        this.filteredCertificates = [...this.certificates];
      },
      error: (err) => console.error('Error loading certificates:', err)
    });
  }
  onSearchChange(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredCertificates = [...this.certificates];  // Reset to all certificates if the search term is empty
    } else {
      // Filter certificates based on the search term
      this.filteredCertificates = this.certificates.filter(cert => 
        cert.recipientName!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cert.title!.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1; // Reset to the first page after filtering
  }
  filteredcert() {
    return this.certificates.filter(cert => {
      return cert.recipientName!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      cert.title!.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }
  
  ngOnInit(): void {
    this.loadCertificates();
  }
  deleteCertificate(id: number): void {
    this.certificateService.deleteCertificate(id).subscribe(() => {
      this.loadCertificates();  // Reload certificates after deletion
    }, error => {
      console.error('Error deleting certificate:', error);
    });
  }
}
