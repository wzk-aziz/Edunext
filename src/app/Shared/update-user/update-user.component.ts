import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  updateForm: FormGroup;
  id!: number;
  user!: User;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.updateForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', [Validators.minLength(6)]],
      mfaEnabled: [false]
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.id) || this.id <= 0) {
      console.error("ID utilisateur invalide !");
      this.router.navigate(['/']);
      return;
    }
    this.loadUser();
  }

  loadUser() {
    this.userService.getUserById(18).subscribe({
      next: (data) => {
        console.log('User data:', data);
        this.user = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données utilisateur:', err);
      }
    });
  }

  updateUser() {
    if (this.updateForm.invalid) {
      alert("Veuillez remplir correctement le formulaire !");
      return;
    }

    const formData: Partial<User> = this.updateForm.value;
    this.userService.updateUser(this.id, formData).subscribe({
      next: () => {
        alert('Utilisateur mis à jour avec succès !');
        this.router.navigate(['/']); // Retour à la liste
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour', error);
        this.handleError('Échec de la mise à jour.');
      }
    });
  }

  private handleError(message: string): void {
    alert(message); // Tu peux remplacer par un toast/snackbar
  }
}