import { CoursesBackComponent } from './courses/courses-back/courses-back.component';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: '', component: BackAppComponent, children: [
    // Routes qui utilisent le layout avec le sidebar
    { 
      path: '', 
      component: LayoutComponent, 
      children: [
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
      ]
    },

    // Routes sans le sidebar
    { path: 'courses', component: CoursesBackComponent },
    { path: 'chat', component: ChatComponent },
    { path: 'reviews', component: ReviewsComponent },
    { path: 'Exam', component: ExamComponent },
    { path: 'Certificat', component: CertificateComponent },
    { path: 'CodingGame', component: CodingGameComponent },
    { path: 'Donation', component: DonationComponent },
    { path: 'Event', component: EventComponent },
    { path: 'Marketplace', component: MarketplaceComponent },
    { path: '**', redirectTo: 'problems' }
  ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackRoutingModule { }