import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Certificate } from 'src/app/models/Certificate';
import { CertificateService } from 'src/app/Services/Certificate_Service';

@Component({
  selector: 'app-certifadminedit',
  templateUrl: './certifadminedit.component.html',
  styleUrls: ['./certifadminedit.component.css']
})
export class CertifadmineditComponent implements OnChanges {
  isCertificatMenuOpen =false;
  isMenuOpen = false;
  searchTerm: string="";
    certificate: Certificate = {};
    isLoading = true;
    certificateForm!: FormGroup; 

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
  
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private certificateService: CertificateService,
      private fb: FormBuilder
    ) { }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  
    ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.loadCertificate(id);

      
        this.certificateForm = this.fb.group({
          title: ['', Validators.required],
          recipientName: ['', Validators.required],
          issueDate: ['', Validators.required]
        });
      
    }
  
    loadCertificate(id: number): void {
      this.isLoading = true;
      this.certificateService.getCertificateById(id).subscribe({
        next: (data) => {
          this.certificate = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading certificate:', err);
          this.isLoading = false;
        }
      });
    }
  
    saveCertificate(): void {
      if (this.certificate && this.certificate.id) {
        const updateData = {
          certificateTitle: this.certificate.certificateTitle, 
          userFullName: this.certificate.userFullName, 
          issuedDate: this.certificate.issuedDate
        };
    
        this.certificateService.updateCertificate(this.certificate.id, updateData)
          .subscribe({
            next: () => {
              console.log("✅ Certificat mis à jour avec succès !");
              this.router.navigate(['/backoffice/Certificat']);
            },
            error: (err) => {
              console.error("❌ Erreur lors de l'update :", err);
            }
          });
      }
    }
    
  
    cancel(): void {
      this.router.navigate(['/backoffice/Certificat']);
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



    isVirtualClassroomMenuOpen = false;
    isVirtualClassroomSubMenuOpen = false;
    isLiveTutoringSubMenuOpen = false;
  
  
    isCodingGameMenuOpen = false;
    isForumMenuOpen = false;
    showSubMenu = false;
  
  
 
  
  
  
    toggleCoursesMenu() {
      this.isMenuOpenCourses = !this.isMenuOpenCourses;
  
    }
  
    toggleMenuForum() {
      this.isForumMenuOpen = !this.isForumMenuOpen;
  
    }
  
    toggleVirtualClassroomMenu() {
      this.isVirtualClassroomMenuOpen = !this.isVirtualClassroomMenuOpen;
    }
  
    toggleVirtualClassroomSubMenu() {
      this.isVirtualClassroomSubMenuOpen = !this.isVirtualClassroomSubMenuOpen;
    }
  
    toggleLiveTutoringSubMenu() {
      this.isLiveTutoringSubMenuOpen = !this.isLiveTutoringSubMenuOpen;
    }
  
  

  isMenuOpenCourses=false;
  
 
  
  
  
  
    toggleCodingGameMenu() {
      this.isCodingGameMenuOpen = !this.isCodingGameMenuOpen;
    }
  
    toggleForumMenu(): void {
      this.isForumMenuOpen = !this.isForumMenuOpen;
    }
  
    toggleSubMenu() {
      this.showSubMenu = !this.showSubMenu;
    }
  }
