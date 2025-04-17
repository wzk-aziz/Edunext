
import { DatePipe } from '@angular/common';

import { NgxPaginationModule } from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Shared Components
import { HeaderComponent } from './Shared/header/header.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { SignupComponent } from './Shared/signup/signup.component';
import { SigninComponent } from './Shared/signin/signin.component';
import { RegisterComponent } from './Shared/register/register.component';
import { LoginComponent } from './Shared/login/login.component';
import { MainhomepageComponent } from './Shared/mainhomepage/mainhomepage.component';
import { ListTeachersComponent } from './Shared/list-teachers/list-teachers.component';
import { UpdateUserComponent } from './Shared/update/update.component';
import { ProfileComponent } from './Shared/profile/profile.component';
import { ChatPanelComponent } from './Shared/classroom/chat-panel/chat-panel.component';
import { ResourcePanelComponent } from './Shared/classroom/resource-panel/resource-panel.component';

// Student Pages
import { LandigpageComponent } from './Student-Pages/landigpage/landigpage.component';
import { PacksComponent } from './Student-Pages/packs/packs.component';
import { CourseslistComponent } from './Student-Pages/Courses/courseslist/courseslist.component';
import { CoursedetailComponent } from './Student-Pages/Courses/coursedetail/coursedetail.component';
import { CoursepageComponent } from './Student-Pages/Courses/coursepage/coursepage.component';
import { MaindashboardComponent } from './Student-Pages/Dashboard/maindashboard/maindashboard.component';
import { SubscriptionComponent } from './Student-Pages/Dashboard/subscription/subscription.component';
import { MycoursesComponent } from './Student-Pages/Dashboard/mycourses/mycourses.component';
import { EditprofileComponent } from './Student-Pages/Dashboard/editprofile/editprofile.component';
import { StudentQuizzesComponent } from './Student-Pages/Courses/Quiz/student-quizzes/student-quizzes.component';
import { TakeQuizComponent } from './Student-Pages/Courses/Quiz/take-quiz/take-quiz.component';
import { QuizResultsComponent } from './Student-Pages/Courses/Quiz/quiz-results/quiz-results.component';
import { LectureWhiteboardComponent } from './Student-Pages/Courses/whiteboard/lecture-whiteboard/lecture-whiteboard.component';
import { PdfViewerComponent } from './Student-Pages/Courses/pdf-viewer/pdf-viewer.component';
import { ExamstudentComponent } from './Student-Pages/exam/examstudent/examstudent.component';
import { ExamstudentdetailsComponent } from './Student-Pages/exam/examstudentdetails/examstudentdetails.component';
import { ExamstudentsubmitComponent } from './Student-Pages/exam/examstudentsubmit/examstudentsubmit.component';
import { CertificateListComponentComponent } from './Student-Pages/exam/certificate-list-component/certificate-list-component.component';
import { ExamResultComponent } from './Student-Pages/exam/exam-result/exam-result.component';
import { CodeEditorComponent } from './Student-Pages/coding-game-student/code-editor/code-editor.component';
import { ProblemListComponent } from './Student-Pages/coding-game-student/problem-list/problem-list.component';
import { SubmissionFormComponent } from './Student-Pages/coding-game-student/submission-form/submission-form.component';
import { BlogListComponent } from './Student-Pages/Forum/Blog/blog-list/blog-list.component';
import { EventDetailComponent } from './Student-Pages/Forum/Event/event-detail/event-detail.component';
import { EventListComponent } from './Student-Pages/Forum/Event/event-list/event-list.component';
import { ThreadAddComponent } from './Student-Pages/Forum/Thread/thread-add/thread-add.component';
import { ThreadListComponent } from './Student-Pages/Forum/Thread/thread-list/thread-list.component';
import { ListProduitComponent } from './Student-Pages/Marketplace/list-produit/list-produit.component';
import { CartComponent } from './Student-Pages/Marketplace/cart/cart.component';
import { PlaceOrderComponent } from './Student-Pages/Marketplace/place-order/place-order.component';
import { MyOrderComponent } from './Student-Pages/Marketplace/my-order/my-order.component';
import { ReviewOrderedProductComponent } from './Student-Pages/Marketplace/review-ordered-product/review-ordered-product.component';
import { ViewOrderedProductsComponent } from './Student-Pages/Marketplace/view-ordered-products/view-ordered-products.component';
import { ViewProductsdetailComponent } from './Student-Pages/Marketplace/view-productsdetail/view-productsdetail.component';
import { ViewWishlistComponent } from './Student-Pages/Marketplace/view-wishlist/view-wishlist.component';
import { DonationComponentComponent } from './Student-Pages/Donnation/donation-component/donation-component.component';
import { EmptypageComponent } from './Student-Pages/emptypage/emptypage.component';
import { StudentVirtualClassroomSessionsComponent } from './Student-Pages/student-virtual-classroom-sessions/student-virtual-classroom-sessions.component';
import { StudentLiveClassComponent } from './Student-Pages/student-live-class/student-live-class.component';
import { StudentTutoringComponent } from './Student-Pages/student-tutoring/student-tutoring.component';
import { StudentChatbotComponent } from './Student-Pages/student-chatbot/student-chatbot.component';

// Teacher Pages
import { HeaderteacherComponent } from './Teacher-Pages/sharedforteacher/headerteacher/headerteacher.component';
import { FooterteacherComponent } from './Teacher-Pages/sharedforteacher/footerteacher/footerteacher.component';
import { TeacherlandingpageComponent } from './Teacher-Pages/sharedforteacher/teacherlandingpage/teacherlandingpage.component';
import { TeachercoursesComponent } from './Teacher-Pages/teacherdashboard/teachercourses/teachercourses.component';
import { StudentslistComponent } from './Teacher-Pages/teacherdashboard/studentslist/studentslist.component';
import { TutoringsessionsComponent } from './Teacher-Pages/teacherdashboard/tutoringsessions/tutoringsessions.component';
import { TeachereditprofileComponent } from './Teacher-Pages/teacherdashboard/teachereditprofile/teachereditprofile.component';
import { EmptypageteacherComponent } from './Teacher-Pages/emptypageteacher/emptypageteacher.component';
import { ExamListComponent } from './Teacher-Pages/teacherdashboard/exam-list/exam-list.component';
import { ExamFormComponent } from './Teacher-Pages/teacherdashboard/exam-form/exam-form.component';
import { ExamEditComponent } from './Teacher-Pages/teacherdashboard/exam-edit/exam-edit.component';
import { TeacherVirtualClassroomsComponent } from './Teacher-Pages/teacher-virtual-classrooms/teacher-virtual-classrooms.component';
import { TeacherDashboardComponent } from './Teacher-Pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherLayoutComponent } from './Teacher-Pages/teacher-layout/teacher-layout.component';
import { TeacherSessionReviewComponent } from './Teacher-Pages/teacher-session-review/teacher-session-review.component';
import { TeacherMentorshipComponent } from './Teacher-Pages/teachermentorship/teachermentorship.component';

// Backend Pages
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
import { SessionComponent } from './backend/VirtualClassroom-Admin/session/session.component';
import { FeedBackComponent } from './backend/VirtualClassroom-Admin/feed-back/feed-back.component';
import { ChatMessageComponent } from './backend/VirtualClassroom-Admin/chat-message/chat-message.component';
import { GoalComponent } from './backend/Tutoring-Admin/goal/goal.component';
import { MentorshipPorgramComponent } from './backend/Tutoring-Admin/mentorship-porgram/mentorship-porgram.component';
import { ProgressReportComponent } from './backend/Tutoring-Admin/progress-report/progress-report.component';
import { LayoutComponent } from './backend/VirtualClassroom-Admin/layout/layout.component';

// Backend Courses and Related Components
///import { CoursesBackComponent } from './backend/courses/courses-back/courses-back.component';
import { CourseFormComponent } from './backend/courses/course-form/course-form.component';
import { CourseUpdateComponent } from './backend/courses/course-update/course-update.component';
import { CoursesListComponent } from './backend/courses/course-list/course-list.component';
import { GlobalAlertComponent } from './global-alert/global-alert.component';
import { LectureCreationFromComponent } from './backend/courses/Lecture/lecture-creation-from/lecture-creation-from.component';
import { ViewlectureComponent } from './backend/courses/Lecture/viewlecture/viewlecture.component';
import { LectureupdateComponent } from './backend/courses/Lecture/lectureupdate/lectureupdate.component';
import { QuizCreationFormComponent } from './backend/courses/Quiz/quiz-creation-form/quiz-creation-form.component';
import { QuizQuestionsComponent } from './backend/courses/Quiz/quiz-questions/quiz-questions.component';
import { ViewQuizesComponent } from './backend/courses/Quiz/view-quizes/view-quizes.component';
import { EditquizComponent } from './backend/courses/Quiz/editquiz/editquiz.component';
import { EditquestionsComponent } from './backend/courses/Quiz/editquestions/editquestions.component';
import { ViewquestionsComponent } from './backend/courses/Quiz/viewquestions/viewquestions.component';

// Backend Exams and Assessment Components
import { CertifadmineditComponent } from './backend/certifadminedit/certifadminedit.component';
import { ExamadmineditComponent } from './backend/examadminedit/examadminedit.component';
import { Certificattop10Component } from './backend/certificattop10/certificattop10.component';
import { Examstop10Component } from './backend/examstop10/examstop10.component';

// Backend Coding Game Admin
import { ProblemsComponent } from './backend/coding-game-admin/problems/problems/problems.component';
import { ProblemFormComponent } from './backend/coding-game-admin/problems/problem-form/problem-form.component';
import { ProblemDetailComponent } from './backend/coding-game-admin/problems/problem-detail/problem-detail.component';
import { LanguageListComponent } from './backend/coding-game-admin/language/language-list/language-list.component';
import { LanguageFormComponent } from './backend/coding-game-admin/language/language-form/language-form.component';
import { LanguageDetailComponent } from './backend/coding-game-admin/language/language-detail/language-detail.component';
import { CompilerListComponent } from './backend/coding-game-admin/compiler/compiler-list/compiler-list.component';
import { CompilerFormComponent } from './backend/coding-game-admin/compiler/compiler-form/compiler-form.component';
import { CompilerDetailComponent } from './backend/coding-game-admin/compiler/compiler-detail/compiler-detail.component';
import { SubmissionStatsComponent } from './backend/coding-game-admin/submission-stats/submission-stats.component';
import { SubmissionLeaderboardComponent } from './backend/coding-game-admin/submission-leaderboard/submission-leaderboard.component';

// Backend Forum
import { ThreadListAdminComponent } from './backend/forum/threads/thread-list-admin/thread-list-admin.component';
import { EventListAdminComponent } from './backend/forum/events/event-list-admin/event-list-admin.component';
import { BlogListAdminComponent } from './backend/forum/blogs/blog-list-admin/blog-list-admin.component';
import { BlogAddComponent } from './backend/forum/blogs/blog-add/blog-add.component';
import { EventAddComponent } from './backend/forum/events/event-add/event-add.component';
import { EventUpdateComponent } from './backend/forum/events/event-update/event-update.component';

// Marketplace Backend
import { ProductBackComponent } from './backend/marketplace/product-back/product-back.component';
import { CategorieBackComponent } from './backend/marketplace/categorie-back/categorie-back.component';
import { CouponBackComponent } from './backend/marketplace/coupon-back/coupon-back.component';
import { ProductFormComponent } from './backend/marketplace/product-form/product-form.component';
import { EditProductComponent } from './backend/marketplace/edit-product/edit-product.component';
import { CategorieFormComponent } from './backend/marketplace/categorie-form/categorie-form.component';
import { EditCategoryComponent } from './backend/marketplace/edit-category/edit-category.component';
import { PostCouponComponent } from './backend/marketplace/post-coupon/post-coupon.component';
import { OrderAnalyticsComponent } from './backend/marketplace/order-analytics/order-analytics.component';
import { DonationsListComponent } from './backend/donation/donations-list/donations-list.component';
import { UsersComponent } from './backend/users/users.component';
import { UserStatsComponent } from './backend/user-stats/user-stats.component';
import { CodeInputModule } from 'angular-code-input';


// Charts & Spinner
import { NgChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// reCAPTCHA
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

// Social Login
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

// JWT
import { JwtModule } from '@auth0/angular-jwt';

// Angular CDK Drag & Drop
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PasswordResetComponent } from './Shared/password-reset/password-reset.component';
import { VerificationComponent } from './Shared/verification/verification.component';
import {OrderBackComponent} from "./backend/marketplace/order-back/order-back.component";
import { ChatbotBubbleComponent } from './Student-Pages/Forum/Event/chatbot-bubble/chatbot-bubble.component';
import { LayoutamalComponent } from './backend/coding-game-admin/layoutamal/layoutamal.component';

export function tokenGetter() {
  return localStorage.getItem("token");
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignupComponent,
    SigninComponent,
    RegisterComponent,
    LoginComponent,
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
    SessionComponent,
    FeedBackComponent,
    ChatMessageComponent,
    GoalComponent,
    MentorshipPorgramComponent,
    ProgressReportComponent,
    LayoutComponent,
    LayoutamalComponent,
    ChatPanelComponent,
    ResourcePanelComponent,
    StudentVirtualClassroomSessionsComponent,
    StudentLiveClassComponent,
    StudentTutoringComponent,
    TeacherVirtualClassroomsComponent,
    TeacherDashboardComponent,
    TeacherLayoutComponent,
    TeacherSessionReviewComponent,
    TeacherMentorshipComponent,
    StudentChatbotComponent,
    // Backend Courses Components
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
    LectureWhiteboardComponent,
    PdfViewerComponent,
    // Backend Exams and Related Components
    ExamListComponent,
    ExamFormComponent,
    ExamEditComponent,
    CertifadmineditComponent,
    ExamadmineditComponent,
    ExamstudentComponent,
    ExamstudentdetailsComponent,
    ExamstudentsubmitComponent,
    Certificattop10Component,
    CertificateListComponentComponent,
    Examstop10Component,
    ExamResultComponent,
    ProblemsComponent,
    ProblemFormComponent,
    ProblemDetailComponent,
    LanguageListComponent,
    LanguageFormComponent,
    LanguageDetailComponent,
    CompilerListComponent,
    CompilerFormComponent,
    CompilerDetailComponent,
    SubmissionStatsComponent,
    SubmissionLeaderboardComponent,
    ThreadListAdminComponent,
    EventListAdminComponent,
    BlogListAdminComponent,
    BlogAddComponent,
    EventAddComponent,
    EventUpdateComponent,
    CodeEditorComponent,
    ProblemListComponent,
    SubmissionFormComponent,
    BlogListComponent,
    EventDetailComponent,
    EventListComponent,
    ThreadAddComponent,
    ThreadListComponent,
    ListProduitComponent,
    CartComponent,
    PlaceOrderComponent,
    MyOrderComponent,
    ReviewOrderedProductComponent,
    ViewOrderedProductsComponent,
    ViewProductsdetailComponent,
    ViewWishlistComponent,
    ProductBackComponent,
    CategorieBackComponent,
    CouponBackComponent,
    ProductFormComponent,
    EditProductComponent,
    CategorieFormComponent,
    EditCategoryComponent,
    PostCouponComponent,
    OrderAnalyticsComponent,
    DonationComponentComponent,
    DonationsListComponent,
    ListTeachersComponent,
    UpdateUserComponent,
    UsersComponent,
    UserStatsComponent,
    ProfileComponent,
    PasswordResetComponent,
    VerificationComponent,
    OrderBackComponent,
    ChatbotBubbleComponent,
    LayoutamalComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NgChartsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    FontAwesomeModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    CodeInputModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:9090"],
        disallowedRoutes: ["localhost:9090/api/v1/auth"]
      }
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],


  providers: [
    HttpClient,
    DatePipe,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('376223933550-gedvfpvklutlp3cqi7frmoa5u33kvgvk.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig
    },
    Router
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
