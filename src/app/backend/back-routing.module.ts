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
import {ProductBackComponent} from "./marketplace/product-back/product-back.component";
import {ProductFormComponent} from "./marketplace/product-form/product-form.component";
import {EditprofileComponent} from "../Student-Pages/Dashboard/editprofile/editprofile.component";
import {EditProductComponent} from "./marketplace/edit-product/edit-product.component";
import {CategorieFormComponent} from "./marketplace/categorie-form/categorie-form.component";
import {CategorieBackComponent} from "./marketplace/categorie-back/categorie-back.component";
import {OrderBackComponent} from "./marketplace/order-back/order-back.component";
import {EditCategoryComponent} from "./marketplace/edit-category/edit-category.component";
import {DonationsListComponent} from "./donation/donations-list/donations-list.component";
import {PostCouponComponent} from "./marketplace/post-coupon/post-coupon.component";


const routes: Routes = [
  { path: '', component: BackAppComponent, children: [
    { path: 'Admin', component: SidebarComponent },
    { path: 'Admin', component: Sidebar2Component },
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
      {path:'productBack',component:ProductBackComponent},
      {path:'courses',component:CoursesBackComponent},
      {path:'categorieBack',component:CategorieBackComponent},
      {path:'edit-category/:categoryId',component:EditCategoryComponent},
      {path:'add-categorie',component:CategorieFormComponent},
      {path:'order',component:OrderBackComponent},
      {path:'add-product',component:ProductFormComponent},
      { path: 'edit-product/:productId', component: EditProductComponent },
      { path: 'listDonnation', component: DonationsListComponent },
      { path: 'addCoupon', component: PostCouponComponent },
    { path: '**', redirectTo: 'Admin' } // Wildcard route for back office
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackRoutingModule { }
