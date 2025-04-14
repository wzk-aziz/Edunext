import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from 'src/app/Student-Pages/Forum/Blog/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-add',
  templateUrl: './blog-add.component.html',
  styleUrls: ['./blog-add.component.css']
})
export class BlogAddComponent implements OnInit {
  blogForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      category: [''],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      this.blogService.addBlog(this.blogForm.value).subscribe({
        next: () => this.router.navigate(['/backoffice/blogs']),
        error: (err) => {
          console.error('Error adding blog:', err);
          alert('Erreur lors de l\'ajout du blog. Veuillez vérifier l\'URL de l\'API et réessayer.');
        }
      });
    }
  }
}
