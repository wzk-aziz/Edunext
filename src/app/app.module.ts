import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { CourseFormComponent } from './backend/courses/course-form/course-form.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CourseUpdateComponent } from './backend/courses/course-update/course-update.component';
import { CoursesListComponent } from './backend/courses/course-list/course-list.component';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { GlobalAlertComponent } from './global-alert/global-alert.component';
import { LectureCreationFromComponent } from './backend/courses/Lecture/lecture-creation-from/lecture-creation-from.component';
import { ViewlectureComponent } from './backend/courses/Lecture/viewlecture/viewlecture.component';
import { CommonModule } from '@angular/common';
import { LectureupdateComponent } from './backend/courses/Lecture/lectureupdate/lectureupdate.component';
import { QuizCreationFormComponent } from './backend/courses/Quiz/quiz-creation-form/quiz-creation-form.component';
import { QuizQuestionsComponent } from './backend/courses/Quiz/quiz-questions/quiz-questions.component';
import { ViewQuizesComponent } from './backend/courses/Quiz/view-quizes/view-quizes.component';
import { EditquizComponent } from './backend/courses/Quiz/editquiz/editquiz.component';
import { EditquestionsComponent } from './backend/courses/Quiz/editquestions/editquestions.component';
import { ViewquestionsComponent } from './backend/courses/Quiz/viewquestions/viewquestions.component';
import { StudentQuizzesComponent } from './Student-Pages/Courses/Quiz/student-quizzes/student-quizzes.component';
import { TakeQuizComponent } from './Student-Pages/Courses/Quiz/take-quiz/take-quiz.component';
import { QuizResultsComponent } from './Student-Pages/Courses/Quiz/quiz-results/quiz-results.component';


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
    CourseFormComponent,
    CourseUpdateComponent,
    CoursesListComponent,
    GlobalAlertComponent,
    LectureCreationFromComponent,
    ViewlectureComponent,
    LectureupdateComponent,
    QuizCreationFormComponent,
    QuizQuestionsComponent,
    ViewQuizesComponent,
    EditquizComponent,
    EditquestionsComponent,
    ViewquestionsComponent,
    StudentQuizzesComponent,
    TakeQuizComponent,
    QuizResultsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgxPaginationModule,
    FormsModule,
    CommonModule,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
