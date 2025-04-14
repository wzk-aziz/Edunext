import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/Student-Pages/Forum/Blog/blog.service';
import { Blog } from 'src/app/Student-Pages/Forum/models/blog.model';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-blog-list-admin',
  templateUrl: './blog-list-admin.component.html',
  styleUrls: ['./blog-list-admin.component.css']
})
export class BlogListAdminComponent implements OnInit {
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  paginatedBlogs: Blog[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  searchTerm: string = '';
  selectedCategory: string = '';
  sortField: 'date' | 'title' | 'views' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    // For development, use the mock articles instead of API call
    this.blogService.getArticles()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (articles) => {
          this.blogs = articles.map(article => ({
            id: article.id,
            title: article.title,
            content: article.previewText,
            category: article.category,
            imageUrl: article.imageUrl,
            createdAt: article.date,
            viewCount: article.views,
            comments: article.comments,
          }));
          this.applyFilters();
        },
        error: (err) => {
          console.error('Error loading blogs:', err);
          this.errorMessage = 'Erreur lors du chargement des blogs. Veuillez réessayer.';
        }
      });
  }

  applyFilters(): void {
    this.filteredBlogs = [...this.blogs];
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredBlogs = this.filteredBlogs.filter(blog => 
        blog.title?.toLowerCase().includes(searchLower) || 
        blog.content?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (this.selectedCategory) {
      this.filteredBlogs = this.filteredBlogs.filter(blog => 
        blog.category === this.selectedCategory
      );
    }
    
    // Apply sorting
    this.filteredBlogs.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortField) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'views':
          comparison = (a.viewCount || 0) - (b.viewCount || 0);
          break;
        case 'date':
        default:
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          comparison = dateA - dateB;
          break;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.totalPages = Math.ceil(this.filteredBlogs.length / this.itemsPerPage);
    this.paginateBlogs();
  }

  paginateBlogs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBlogs = this.filteredBlogs.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(field: 'date' | 'title' | 'views'): void {
    if (this.sortField === field) {
      // Toggle direction if clicking the same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      // Default to descending for date and views, ascending for title
      this.sortDirection = field === 'title' ? 'asc' : 'desc';
    }
    this.applyFilters();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateBlogs();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateBlogs();
    }
  }

  navigateToAddBlog(): void {
    this.router.navigate(['/backoffice/blogs/add']);
  }

  editBlog(id: number): void {
    this.router.navigate(['/backoffice/blogs/edit', id]);
  }

  viewBlog(id: number): void {
    this.router.navigate(['/backoffice/blogs/view', id]);
  }

  deleteBlog(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce blog ?')) {
      this.isLoading = true;
      this.blogService.deleteBlog(id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.blogs = this.blogs.filter(blog => blog.id !== id);
            this.applyFilters();
          },
          error: (err) => {
            console.error('Error deleting blog:', err);
            this.errorMessage = 'Erreur lors de la suppression du blog. Veuillez réessayer.';
          }
        });
    }
  }

  getUniqueCategories(): string[] {
    const categories = new Set<string>();
    this.blogs.forEach(blog => {
      if (blog.category) {
        categories.add(blog.category);
      }
    });
    return Array.from(categories).sort();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default-thumbnail.png';
  }
}