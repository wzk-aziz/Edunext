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
import { TeachersComponent } from './teachers/teachers.component';
import { UsersComponent } from './users/users.component';
import { UserStatsComponent } from './user-stats/user-stats.component';

const routes: Routes = [
  { path: '', component: BackAppComponent, children: [
    { path: 'Admin', component: SidebarComponent },
    { path: 'Admin', component: Sidebar2Component },
    { path: 'Student', component: StudentComponent },
    { path: 'Class', component: ClassComponent },
    { path : 'teachers', component: TeachersComponent},
    { path: 'video_class', component: VideoClassComponent },
    { path: 'chat', component: ChatComponent },
    { path: 'reviews', component: ReviewsComponent },
    { path: 'Exam', component: ExamComponent },
    { path: 'Certificat', component: CertificateComponent },
    { path: 'CodingGame', component: CodingGameComponent },
    { path: 'Donation', component: DonationComponent },
    { path: 'Event', component: EventComponent },
    { path: 'Marketplace', component: MarketplaceComponent },
    {path:'courses',component:CoursesBackComponent},
    { path: 'users', component: UsersComponent },
    { path: 'user-stats', component:UserStatsComponent},
    { path: '**', redirectTo: 'Admin' } // Wildcard route for back office
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackRoutingModule { }