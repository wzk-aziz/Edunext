import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Thread } from '../../models/thread.model';
import { ThreadService } from '../thread.service';

@Component({
  selector: 'app-thread-add',
  templateUrl: './thread-add.component.html',
  styleUrls: ['./thread-add.component.css']
})
export class ThreadAddComponent implements OnInit {
  threadForm: FormGroup;
  isSubmitting = false;
  error = '';
  forumId: number | null = null;
  suggestedTags: string[] = ['angular', 'javascript', 'typescript', 'spring', 'java', 'css', 'html'];
  currentUserEmail = 'current-user@example.com'; // À remplacer par un service d'auth

  constructor(
    private formBuilder: FormBuilder,
    private threadService: ThreadService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.threadForm = this.formBuilder.group({
      threadTitle: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      threadContent: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['forumId']) {
        this.forumId = +params['forumId'];
      } else {
        this.forumId = 1; // Valeur par défaut
      }
    });
  }

  onSubmit(): void {
    if (this.threadForm.invalid || this.forumId === null) {
      return;
    }

    this.isSubmitting = true;

    // ✅ Création correcte d'un objet `Thread`
    const newThread: Thread = {
      threadTitle: this.threadForm.value.threadTitle,
      threadContent: this.threadForm.value.threadContent,
      forum: { id: this.forumId } as any, // Assurez-vous que forum existe bien
      reactions: [] // Initialiser à un tableau vide pour éviter des erreurs
    };

    // ✅ Envoi au service ThreadService avec `forumId`
    this.threadService.createThread(newThread, this.forumId).subscribe({
      next: (thread) => {
        this.isSubmitting = false;
        this.router.navigate(['/thread', thread.id]); // Redirection après création
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = 'Failed to create thread. Please try again.';
        console.error('Error creating thread:', err);
      }
    });
  }

  addTag(tag: string): void {
    const currentContent = this.threadForm.get('threadContent')?.value || '';
    if (!currentContent.includes(`#${tag}`)) {
      this.threadForm.patchValue({
        threadContent: currentContent + ` #${tag}`
      });
    }
  }
}
