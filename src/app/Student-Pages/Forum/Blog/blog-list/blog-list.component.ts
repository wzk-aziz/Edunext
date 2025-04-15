import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';

interface BlogArticle {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  previewText: string;
  date: Date;
  views: number;
  comments: number;
}

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  articles: BlogArticle[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.blogService.getArticles()
      .subscribe({
        next: (data) => {
          this.articles = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching articles:', err);
          this.error = 'Failed to load articles. Please try again later.';
          this.loading = false;
        }
      });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
}