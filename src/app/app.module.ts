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
import { ListProduitComponent } from './Student-Pages/Marketplace/list-produit/list-produit.component';
import { CartComponent } from './Student-Pages/Marketplace/cart/cart.component';
import {HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { PlaceOrderComponent } from './Student-Pages/Marketplace/place-order/place-order.component';
import { MyOrderComponent } from './Student-Pages/Marketplace/my-order/my-order.component';
import { ReviewOrderedProductComponent } from './Student-Pages/Marketplace/review-ordered-product/review-ordered-product.component';
import { ViewOrderedProductsComponent } from './Student-Pages/Marketplace/view-ordered-products/view-ordered-products.component';
import { ViewProductsdetailComponent } from './Student-Pages/Marketplace/view-productsdetail/view-productsdetail.component';
import { ViewWishlistComponent } from './Student-Pages/Marketplace/view-wishlist/view-wishlist.component';
import { MatButtonModule } from '@angular/material/button';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MatDialogModule } from '@angular/material/dialog';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import { OrderBackComponent } from './backend/marketplace/order-back/order-back.component';
import { CategorieBackComponent } from './backend/marketplace/categorie-back/categorie-back.component';
import { CouponBackComponent } from './backend/marketplace/coupon-back/coupon-back.component';
import {ProductBackComponent} from "./backend/marketplace/product-back/product-back.component";
import { ProductFormComponent } from './backend/marketplace/product-form/product-form.component';
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import { EditProductComponent } from './backend/marketplace/edit-product/edit-product.component';
import { CategorieFormComponent } from './backend/marketplace/categorie-form/categorie-form.component';
import {MatTableModule} from "@angular/material/table";
import {MatMenuModule} from "@angular/material/menu";
import { EditCategoryComponent } from './backend/marketplace/edit-category/edit-category.component';
import { DonationComponentComponent } from './Student-Pages/Donnation/donation-component/donation-component.component';
import { DonationsListComponent } from './backend/donation/donations-list/donations-list.component';
import { PostCouponComponent } from './backend/marketplace/post-coupon/post-coupon.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";



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
    DonationComponentComponent,
    DonationsListComponent,
    PostCouponComponent,




  ],
  imports: [
    MatIconModule,
    MatSelectModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,  // <-- Ajoutez ReactiveFormsModule
    MatFormFieldModule,   // <-- Ajoutez MatFormFieldModule
    MatInputModule,       // <-- Ajoutez MatInputModule      // <-- Ajoutez MatButtonModule
    MatCardModule,
    MatTableModule,
    MatMenuModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule

    // Ajoutez ce module pour utiliser mat-card, mat-card-title, etc.


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
