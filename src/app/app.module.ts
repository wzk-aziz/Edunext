import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSpinnerModule } from 'ngx-spinner';
// Loading spinner
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Shared/header/header.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { SignupComponent } from './Shared/signup/signup.component';
import { SigninComponent } from './Shared/signin/signin.component';
import { LandigpageComponent } from './Student-Pages/landigpage/landigpage.component';
import { PacksComponent } from './Student-Pages/packs/packs.component';
import { MainhomepageComponent } from './Shared/mainhomepage/mainhomepage.component';
import { CourseslistComponent } from './Student-Pages/Courses/courseslist/courseslist.component';
import { CoursedetailComponent } from './Student-Pages/Courses/coursedetail/coursedetail.component';
import { CoursepageComponent } from './Student-Pages/Courses/coursepage/coursepage.component';
import { MaindashboardComponent } from './Student-Pages/Dashboard/maindashboard/maindashboard.component';
import { SubscriptionComponent } from './Student-Pages/Dashboard/subscription/subscription.component';
import { MycoursesComponent } from './Student-Pages/Dashboard/mycourses/mycourses.component';
import { EditprofileComponent } from './Student-Pages/Dashboard/editprofile/editprofile.component';
import { HeaderteacherComponent } from './Teacher-Pages/sharedforteacher/headerteacher/headerteacher.component';
import { FooterteacherComponent } from './Teacher-Pages/sharedforteacher/footerteacher/footerteacher.component';
import { CoursequizesComponent } from './Student-Pages/Courses/Quiz/coursequizes/coursequizes.component';
import { StandalonequizesComponent } from './Student-Pages/Courses/Quiz/standalonequizes/standalonequizes.component';
import { EmptypageComponent } from './Student-Pages/emptypage/emptypage.component';
import { TeacherlandingpageComponent } from './Teacher-Pages/sharedforteacher/teacherlandingpage/teacherlandingpage.component';
import { TeachercoursesComponent } from './Teacher-Pages/teacherdashboard/teachercourses/teachercourses.component';
import { StudentslistComponent } from './Teacher-Pages/teacherdashboard/studentslist/studentslist.component';
import { TutoringsessionsComponent } from './Teacher-Pages/teacherdashboard/tutoringsessions/tutoringsessions.component';
import { TeachereditprofileComponent } from './Teacher-Pages/teacherdashboard/teachereditprofile/teachereditprofile.component';
import { EmptypageteacherComponent } from './Teacher-Pages/emptypageteacher/emptypageteacher.component';
import { CertificateComponent } from './backend/certificate/certificate.component';
import { ChatComponent } from './backend/chat/chat.component';
import { CodingGameComponent } from './backend/coding-game/coding-game.component';
import { DonationComponent } from './backend/donation/donation.component';
import { EventComponent } from './backend/event/event.component';
import { ExamComponent } from './backend/exam/exam.component';
import { FileStorageComponent } from './backend/file-storage/file-storage.component';
import { MarketplaceComponent } from './backend/marketplace/marketplace.component';
import { ReviewsComponent } from './backend/reviews/reviews.component';
import { SidebarComponent } from './backend/sidebar/sidebar.component';
import { Sidebar2Component } from './backend/sidebar2/sidebar2.component';
import { TeachersComponent } from './backend/teachers/teachers.component';
import { VideoClassComponent } from './backend/video-class/video-class.component';
import { ClassComponent } from './backend/sidebar/class/class.component';
import { StudentComponent } from './backend/sidebar/student/student.component';
import { BackAppComponent } from './backend/back-app/back-app.component';
import { CoursesBackComponent } from './backend/courses/courses-back/courses-back.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProblemDetailComponent } from './backend/coding-game-admin/problems/problem-detail/problem-detail.component';
import { ProblemFormComponent } from './backend/coding-game-admin/problems/problem-form/problem-form.component';
import { ProblemsComponent } from './backend/coding-game-admin/problems/problems/problems.component';
import { LanguageListComponent } from './backend/coding-game-admin/language/language-list/language-list.component';
import { LanguageFormComponent } from './backend/coding-game-admin/language/language-form/language-form.component';
import { LanguageDetailComponent } from './backend/coding-game-admin/language/language-detail/language-detail.component';
import { CompilerListComponent } from './backend/coding-game-admin/compiler/compiler-list/compiler-list.component';
import { CompilerFormComponent } from './backend/coding-game-admin/compiler/compiler-form/compiler-form.component';
import { CompilerDetailComponent } from './backend/coding-game-admin/compiler/compiler-detail/compiler-detail.component';
import { LayoutComponent } from './backend/coding-game-admin/layout/layout.component';
import { CodeEditorComponent } from './Student-Pages/coding-game-student/code-editor/code-editor.component';
import { ProblemListComponent } from './Student-Pages/coding-game-student/problem-list/problem-list.component';
import { BlogListComponent } from './Student-Pages/Forum/Blog/blog-list/blog-list.component';
import { EventDetailComponent } from './Student-Pages/Forum/Event/event-detail/event-detail.component';
import { EventListComponent } from './Student-Pages/Forum/Event/event-list/event-list.component';
import { ThreadAddComponent } from './Student-Pages/Forum/Thread/thread-add/thread-add.component';
import { ThreadListComponent } from './Student-Pages/Forum/Thread/thread-list/thread-list.component';
import { jsPDF } from 'jspdf';
import { ThreadListAdminComponent } from './backend/forum/threads/thread-list-admin/thread-list-admin.component';
import { EventListAdminComponent } from './backend/forum/events/event-list-admin/event-list-admin.component';
import { BlogListAdminComponent } from './backend/forum/blogs/blog-list-admin/blog-list-admin.component';
import { BlogAddComponent } from './backend/forum/blogs/blog-add/blog-add.component';
import { EventAddComponent } from './backend/forum/events/event-add/event-add.component';
import { LoginComponent } from './Shared/login/login.component';
import { EventUpdateComponent } from './backend/forum/events/event-update/event-update.component';
import { SubmissionFormComponent } from './Student-Pages/coding-game-student/submission-form/submission-form.component';
import { SubmissionStatsComponent } from './backend/coding-game-admin/submission-stats/submission-stats.component';
import { StatisticsDashboardComponent } from './backend/coding-game-admin/statistics-dashboard/statistics-dashboard.component';
import { SubmissionLeaderboardComponent } from './backend/coding-game-admin/submission-leaderboard/submission-leaderboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignupComponent,
    SigninComponent,
    LandigpageComponent,
    PacksComponent,
    MainhomepageComponent,
    CourseslistComponent,
    CoursedetailComponent,
    CoursepageComponent,
    MaindashboardComponent,
    SubscriptionComponent,
    MycoursesComponent,
    EditprofileComponent,
    HeaderteacherComponent,
    FooterteacherComponent,
    CoursequizesComponent,
    StandalonequizesComponent,
    EmptypageComponent,
    TeacherlandingpageComponent,
    TeachercoursesComponent,
    StudentslistComponent,
    TutoringsessionsComponent,
    TeachereditprofileComponent,
    EmptypageteacherComponent,
    CertificateComponent,
    ChatComponent,
    CodingGameComponent,
    DonationComponent,
    EventComponent,
    ExamComponent,
    FileStorageComponent,
    MarketplaceComponent,
    ReviewsComponent,
    SidebarComponent,
    Sidebar2Component,
    TeachersComponent,
    VideoClassComponent,
    ClassComponent,
    StudentComponent,
    BackAppComponent,
    CoursesBackComponent,
    ProblemsComponent,
    ProblemFormComponent,
    ProblemDetailComponent,
    LanguageListComponent,
    LanguageFormComponent,
    LanguageDetailComponent,
    CompilerListComponent,
    CompilerFormComponent,
    CompilerDetailComponent,
    LayoutComponent,
    ProblemListComponent,
    CodeEditorComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    CodeEditorComponent,
    BlogListComponent,
    EventDetailComponent,
    EventListComponent,
    ThreadAddComponent,
    ThreadListComponent,
    ThreadListAdminComponent,
    EventListAdminComponent,
    BlogListAdminComponent,
    BlogAddComponent,
    EventAddComponent,
    LoginComponent,
    EventUpdateComponent,
    SubmissionFormComponent,
    SubmissionStatsComponent,
    StatisticsDashboardComponent,
    SubmissionLeaderboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule, 
    HttpClientModule,
    RouterModule,
    NgChartsModule,
    NgxSpinnerModule,
    FontAwesomeModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
