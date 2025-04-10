import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoursesBackComponent } from './courses/courses-back/courses-back.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Sidebar2Component } from './sidebar2/sidebar2.component';
import { StudentComponent } from './sidebar/student/student.component';
import { ClassComponent } from './sidebar/class/class.component';
import { VideoClassComponent } from './video-class/video-class.component';
import { ChatComponent } from './chat/chat.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ExamComponent } from './exam/exam.component';
import { CertificateComponent } from './certificate/certificate.component';
import { CodingGameComponent } from './coding-game/coding-game.component';
import { DonationComponent } from './donation/donation.component';
import { EventComponent } from './event/event.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { BackAppComponent } from './back-app/back-app.component';

// Coding Game & Forum Admin
import { ProblemsComponent } from './coding-game-admin/problems/problems/problems.component';
import { ProblemFormComponent } from './coding-game-admin/problems/problem-form/problem-form.component';
import { ProblemDetailComponent } from './coding-game-admin/problems/problem-detail/problem-detail.component';
import { LanguageListComponent } from './coding-game-admin/language/language-list/language-list.component';
import { LanguageFormComponent } from './coding-game-admin/language/language-form/language-form.component';
import { LanguageDetailComponent } from './coding-game-admin/language/language-detail/language-detail.component';
import { CompilerListComponent } from './coding-game-admin/compiler/compiler-list/compiler-list.component';
import { CompilerFormComponent } from './coding-game-admin/compiler/compiler-form/compiler-form.component';
import { CompilerDetailComponent } from './coding-game-admin/compiler/compiler-detail/compiler-detail.component';
import { LayoutComponent } from './coding-game-admin/layout/layout.component';
import { ThreadListAdminComponent } from './forum/threads/thread-list-admin/thread-list-admin.component';
import { BlogListAdminComponent } from './forum/blogs/blog-list-admin/blog-list-admin.component';
import { EventListAdminComponent } from './forum/events/event-list-admin/event-list-admin.component';
import { BlogAddComponent } from './forum/blogs/blog-add/blog-add.component';
import { EventUpdateComponent } from './forum/events/event-update/event-update.component';
import { SubmissionStatsComponent } from './coding-game-admin/submission-stats/submission-stats.component';
import { SubmissionLeaderboardComponent } from './coding-game-admin/submission-leaderboard/submission-leaderboard.component';

// Marketplace & Donation
import { ProductBackComponent } from './marketplace/product-back/product-back.component';
import { ProductFormComponent } from './marketplace/product-form/product-form.component';
import { EditProductComponent } from './marketplace/edit-product/edit-product.component';
import { CategorieFormComponent } from './marketplace/categorie-form/categorie-form.component';
import { CategorieBackComponent } from './marketplace/categorie-back/categorie-back.component';
import { OrderBackComponent } from './marketplace/order-back/order-back.component';
import { EditCategoryComponent } from './marketplace/edit-category/edit-category.component';
import { PostCouponComponent } from './marketplace/post-coupon/post-coupon.component';
import { CouponBackComponent } from './marketplace/coupon-back/coupon-back.component';
import { OrderAnalyticsComponent } from './marketplace/order-analytics/order-analytics.component';
import { DonationsListComponent } from './donation/donations-list/donations-list.component';

// Users
import { UsersComponent } from './users/users.component';
import { UserStatsComponent } from './user-stats/user-stats.component';

const routes: Routes = [
  {
    path: '',
    component: BackAppComponent,
    children: [
      // Layout spécifique avec sidebar pour les admins
      {
        path: '',
        component: LayoutComponent,
        children: [
          { path: 'submissions/stats', component: SubmissionLeaderboardComponent },
          { path: 'problems', component: ProblemsComponent },
          { path: 'problems/new', component: ProblemFormComponent },
          { path: 'problems/edit/:id', component: ProblemFormComponent },
          { path: 'problems/view/:id', component: ProblemDetailComponent },
          { path: 'languages', component: LanguageListComponent },
          { path: 'languages/new', component: LanguageFormComponent },
          { path: 'languages/edit/:id', component: LanguageFormComponent },
          { path: 'languages/view/:id', component: LanguageDetailComponent },
          { path: 'compilers', component: CompilerListComponent },
          { path: 'compilers/new', component: CompilerFormComponent },
          { path: 'compilers/edit/:id', component: CompilerFormComponent },
          { path: 'compilers/view/:id', component: CompilerDetailComponent },
          { path: 'threads', component: ThreadListAdminComponent },
          { path: 'blogs', component: BlogListAdminComponent },
          { path: 'events', component: EventListAdminComponent },
          { path: 'blogs/add', component: BlogAddComponent },
          { path: 'event/add', component: EventComponent },
          { path: 'event/update', component: EventUpdateComponent },
        ],
      },

      // Autres routes
      { path: 'Admin', component: SidebarComponent },
      { path: 'Admin', component: Sidebar2Component },
      { path: 'Student', component: StudentComponent },
      { path: 'Class', component: ClassComponent },
      { path: 'teachers', component: ClassComponent },
      { path: 'video_class', component: VideoClassComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'Exam', component: ExamComponent },
      { path: 'Certificat', component: CertificateComponent },
      { path: 'CodingGame', component: CodingGameComponent },
      { path: 'Donation', component: DonationComponent },
      { path: 'Event', component: EventComponent },
      { path: 'Marketplace', component: MarketplaceComponent },

      // Marketplace spécifiques
      { path: 'productBack', component: ProductBackComponent },
      { path: 'add-product', component: ProductFormComponent },
      { path: 'edit-product/:productId', component: EditProductComponent },
      { path: 'categorieBack', component: CategorieBackComponent },
      { path: 'edit-category/:categoryId', component: EditCategoryComponent },
      { path: 'add-categorie', component: CategorieFormComponent },
      { path: 'order', component: OrderBackComponent },
      { path: 'addCoupon', component: PostCouponComponent },
      { path: 'coupon', component: CouponBackComponent },
      { path: 'analyse', component: OrderAnalyticsComponent },
      { path: 'listDonnation', component: DonationsListComponent },

      // Users
      { path: 'users', component: UsersComponent },
      { path: 'user-stats', component: UserStatsComponent },

      // Cours
      { path: 'courses', component: CoursesBackComponent },

      // Wildcard
      { path: '**', redirectTo: 'Admin' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackRoutingModule { }
