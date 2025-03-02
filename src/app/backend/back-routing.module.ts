import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackAppComponent } from './back-app/back-app.component';
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
import { CoursesBackComponent } from './courses/courses-back/courses-back.component';
import { SessionComponent } from './VirtualClassroom-Admin/session/session.component'; // Import the existing component
import { MentorshipPorgramComponent } from './Tutoring-Admin/mentorship-porgram/mentorship-porgram.component'; // Import the MentorshipProgramComponent
import { LayoutComponent } from './VirtualClassroom-Admin/layout/layout.component';
import { ChatMessageComponent } from './VirtualClassroom-Admin/chat-message/chat-message.component';
import { FeedBackComponent } from './VirtualClassroom-Admin/feed-back/feed-back.component'; // Import the FeedBackComponent
import { GoalComponent } from './Tutoring-Admin/goal/goal.component';
import { ProgressReportComponent } from './Tutoring-Admin/progress-report/progress-report.component';






const routes: Routes = [
  {
    path: '', 
    component: LayoutComponent, children: [
      { path: 'Admin', component: SidebarComponent },
      { path: 'Admin2', component: Sidebar2Component }, // Changed path to avoid duplicate
      { path: 'Student', component: StudentComponent },
      { path: 'Class', component: ClassComponent },
      { path: 'video_class', component: VideoClassComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'Exam', component: ExamComponent },
      { path: 'Certificat', component: CertificateComponent },
      { path: 'CodingGame', component: CodingGameComponent },
      { path: 'Donation', component: DonationComponent },
      { path: 'Event', component: EventComponent },
      { path: 'Marketplace', component: MarketplaceComponent },
      { path: 'courses', component: CoursesBackComponent }, // Use the existing SessionComponent
      { path: 'mentorship-programs', component: MentorshipPorgramComponent },
      { path: 'sessions', component: SessionComponent },
      { path: 'chat-messages', component: ChatMessageComponent },
      { path: 'feedbacks', component: FeedBackComponent },
      { path: 'goals', component: GoalComponent },
      { path: 'progress-reports', component: ProgressReportComponent },
      
      

      { path: '**', redirectTo: 'Admin' } // Wildcard route for back office
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackRoutingModule { }