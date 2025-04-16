import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Routing Modules
import { AppRoutingModule } from './app-routing.module';
import { BackRoutingModule } from './backend/back-routing.module';

// Charts & Spinner
import { NgChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Material Modules
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
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';

// reCAPTCHA
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

// Google login
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

// Déclarations de tous les composants
import { AppComponent } from './app.component';
import { HeaderComponent } from './Shared/header/header.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { RegisterComponent } from './Shared/register/register.component';
import { LoginComponent } from './Shared/login/login.component';
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
import { LayoutComponent } from './backend/coding-game-admin/layout/layout.component';
import { SubmissionStatsComponent } from './backend/coding-game-admin/submission-stats/submission-stats.component';
import { SubmissionLeaderboardComponent } from './backend/coding-game-admin/submission-leaderboard/submission-leaderboard.component';

// Backend Forum
import { ThreadListAdminComponent } from './backend/forum/threads/thread-list-admin/thread-list-admin.component';
import { EventListAdminComponent } from './backend/forum/events/event-list-admin/event-list-admin.component';
import { BlogListAdminComponent } from './backend/forum/blogs/blog-list-admin/blog-list-admin.component';
import { BlogAddComponent } from './backend/forum/blogs/blog-add/blog-add.component';
import { EventAddComponent } from './backend/forum/events/event-add/event-add.component';
import { EventUpdateComponent } from './backend/forum/events/event-update/event-update.component';

// Student Pages Forum & CodingGame
import { CodeEditorComponent } from './Student-Pages/coding-game-student/code-editor/code-editor.component';
import { ProblemListComponent } from './Student-Pages/coding-game-student/problem-list/problem-list.component';
import { SubmissionFormComponent } from './Student-Pages/coding-game-student/submission-form/submission-form.component';
import { BlogListComponent } from './Student-Pages/Forum/Blog/blog-list/blog-list.component';
import { EventDetailComponent } from './Student-Pages/Forum/Event/event-detail/event-detail.component';
import { EventListComponent } from './Student-Pages/Forum/Event/event-list/event-list.component';
import { ThreadAddComponent } from './Student-Pages/Forum/Thread/thread-add/thread-add.component';
import { ThreadListComponent } from './Student-Pages/Forum/Thread/thread-list/thread-list.component';

// Marketplace Front & Back
import { ListProduitComponent } from './Student-Pages/Marketplace/list-produit/list-produit.component';
import { CartComponent } from './Student-Pages/Marketplace/cart/cart.component';
import { PlaceOrderComponent } from './Student-Pages/Marketplace/place-order/place-order.component';
import { MyOrderComponent } from './Student-Pages/Marketplace/my-order/my-order.component';
import { ReviewOrderedProductComponent } from './Student-Pages/Marketplace/review-ordered-product/review-ordered-product.component';
import { ViewOrderedProductsComponent } from './Student-Pages/Marketplace/view-ordered-products/view-ordered-products.component';
import { ViewProductsdetailComponent } from './Student-Pages/Marketplace/view-productsdetail/view-productsdetail.component';
import { ViewWishlistComponent } from './Student-Pages/Marketplace/view-wishlist/view-wishlist.component';
import { ProductBackComponent } from './backend/marketplace/product-back/product-back.component';
import { OrderBackComponent } from './backend/marketplace/order-back/order-back.component';
import { CategorieBackComponent } from './backend/marketplace/categorie-back/categorie-back.component';
import { CouponBackComponent } from './backend/marketplace/coupon-back/coupon-back.component';
import { ProductFormComponent } from './backend/marketplace/product-form/product-form.component';
import { EditProductComponent } from './backend/marketplace/edit-product/edit-product.component';
import { CategorieFormComponent } from './backend/marketplace/categorie-form/categorie-form.component';
import { EditCategoryComponent } from './backend/marketplace/edit-category/edit-category.component';
import { PostCouponComponent } from './backend/marketplace/post-coupon/post-coupon.component';
import { OrderAnalyticsComponent } from './backend/marketplace/order-analytics/order-analytics.component';

// Others
import { DonationComponentComponent } from './Student-Pages/Donnation/donation-component/donation-component.component';
import { DonationsListComponent } from './backend/donation/donations-list/donations-list.component';
import { ListTeachersComponent } from './Shared/list-teachers/list-teachers.component';
import { UpdateUserComponent } from './Shared/update/update.component';
import { UsersComponent } from './backend/users/users.component';
import { UserStatsComponent } from './backend/user-stats/user-stats.component';
import { ProfileComponent } from './Shared/profile/profile.component';
import { ChatbotBubbleComponent } from './Student-Pages/Forum/Event/chatbot-bubble/chatbot-bubble.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
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
    OrderBackComponent,
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
    ChatbotBubbleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    BackRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartsModule,
    NgxSpinnerModule,
    FontAwesomeModule,
    // Material Modules
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTableModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatNativeDateModule,
    // reCAPTCHA
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [
    HttpClient,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('376223933550-gedvfpvklutlp3cqi7frmoa5u33kvgvk.apps.googleusercontent.com')
          },
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}