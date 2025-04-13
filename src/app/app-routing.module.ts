import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './Shared/signup/signup.component';
import { SigninComponent } from './Shared/signin/signin.component';
import { LoginComponent } from './Shared/login/login.component';
import { RegisterComponent } from './Shared/register/register.component';
import { LandigpageComponent } from './Student-Pages/landigpage/landigpage.component';
import { PacksComponent } from './Student-Pages/packs/packs.component';
import { MainhomepageComponent } from './Shared/mainhomepage/mainhomepage.component';
import { MaindashboardComponent } from './Student-Pages/Dashboard/maindashboard/maindashboard.component';
import { MycoursesComponent } from './Student-Pages/Dashboard/mycourses/mycourses.component';
import { SubscriptionComponent } from './Student-Pages/Dashboard/subscription/subscription.component';
import { EditprofileComponent } from './Student-Pages/Dashboard/editprofile/editprofile.component';
import { CourseslistComponent } from './Student-Pages/Courses/courseslist/courseslist.component';
import { CoursedetailComponent } from './Student-Pages/Courses/coursedetail/coursedetail.component';
import { CoursepageComponent } from './Student-Pages/Courses/coursepage/coursepage.component';
import { CoursequizesComponent } from './Student-Pages/Courses/Quiz/coursequizes/coursequizes.component';
import { EmptypageComponent } from './Student-Pages/emptypage/emptypage.component';
import { TeacherlandingpageComponent } from './Teacher-Pages/sharedforteacher/teacherlandingpage/teacherlandingpage.component';
import { TeachercoursesComponent } from './Teacher-Pages/teacherdashboard/teachercourses/teachercourses.component';
import { TeachereditprofileComponent } from './Teacher-Pages/teacherdashboard/teachereditprofile/teachereditprofile.component';
import { StudentslistComponent } from './Teacher-Pages/teacherdashboard/studentslist/studentslist.component';
import { TutoringsessionsComponent } from './Teacher-Pages/teacherdashboard/tutoringsessions/tutoringsessions.component';
import { EmptypageteacherComponent } from './Teacher-Pages/emptypageteacher/emptypageteacher.component';
import { ProblemDetailComponent } from './Student-Pages/coding-game-student/problem-detail/problem-detail.component';
import { CodeEditorComponent } from './Student-Pages/coding-game-student/code-editor/code-editor.component';
import { ProblemListComponent } from './Student-Pages/coding-game-student/problem-list/problem-list.component';
import { SubmissionFormComponent } from './Student-Pages/coding-game-student/submission-form/submission-form.component';

import { BlogListComponent } from './Student-Pages/Forum/Blog/blog-list/blog-list.component';
import { ThreadListComponent } from './Student-Pages/Forum/Thread/thread-list/thread-list.component';
import { ThreadAddComponent } from './Student-Pages/Forum/Thread/thread-add/thread-add.component';
import { EventListComponent } from './Student-Pages/Forum/Event/event-list/event-list.component';
import { EventDetailComponent } from './Student-Pages/Forum/Event/event-detail/event-detail.component';

import { DonationComponentComponent } from './Student-Pages/Donnation/donation-component/donation-component.component';
import { ListTeachersComponent } from './Shared/list-teachers/list-teachers.component';
import { UpdateUserComponent } from './Shared/update/update.component';
import { TeachersComponent } from './backend/teachers/teachers.component';
import { UsersComponent } from './backend/users/users.component';
import { UserStatsComponent } from './backend/user-stats/user-stats.component';
import { ProfileComponent } from './Shared/profile/profile.component';

import { ListProduitComponent } from './Student-Pages/Marketplace/list-produit/list-produit.component';
import { CartComponent } from './Student-Pages/Marketplace/cart/cart.component';
import { MyOrderComponent } from './Student-Pages/Marketplace/my-order/my-order.component';
import { ViewWishlistComponent } from './Student-Pages/Marketplace/view-wishlist/view-wishlist.component';
import { BackRoutingModule } from './backend/back-routing.module'; // Import the new module
import { ExamListComponent } from './Teacher-Pages/teacherdashboard/exam-list/exam-list.component';
import { ExamFormComponent } from './Teacher-Pages/teacherdashboard/exam-form/exam-form.component';
import { ExamEditComponent } from './Teacher-Pages/teacherdashboard/exam-edit/exam-edit.component';
import { ExamadmineditComponent } from './backend/examadminedit/examadminedit.component';
import { CertifadmineditComponent } from './backend/certifadminedit/certifadminedit.component';
import { CertificateComponent } from './Teacher-Pages/teacherdashboard/certificate/certificate.component';
import { ExamstudentComponent } from './Student-Pages/exam/examstudent/examstudent.component';
import { ExamstudentsubmitComponent } from './Student-Pages/exam/examstudentsubmit/examstudentsubmit.component';
import { CertificateListComponentComponent } from './Student-Pages/exam/certificate-list-component/certificate-list-component.component';
import { ExamResultComponent } from './Student-Pages/exam/exam-result/exam-result.component';
import { authGuard } from './Shared/services/auth/auth.guard';

const routes: Routes = [
  // Main Landing Page
  //{ path: 'main', component: MainhomepageComponent },
  
  // Student Routes
  { path: 'studenthome', component: LandigpageComponent },
 // { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },

  // Main Landing Page
  { path: 'main', component: MainhomepageComponent, canActivate: [authGuard] },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Profile & User
  { path: 'profile', component: ProfileComponent },
  { path: 'update', component: UpdateUserComponent },
  { path: 'update/:id', component: UpdateUserComponent },
  { path: 'users', component: UsersComponent },
  { path: 'user-stats', component: UserStatsComponent },

  // Student Routes
  { path: 'studenthome', component: LandigpageComponent },
  { path: 'pricing', component: PacksComponent },
  { path: 'studentdashboard', component: MaindashboardComponent },
  { path: 'myplan', component: SubscriptionComponent },
  { path: 'editprofile', component: EditprofileComponent },
   //exam
  { path: 'examstudent', component: ExamstudentComponent },
  { path: 'exam/:id', component: ExamstudentsubmitComponent },
  { path: 'certificatet', component: CertificateListComponentComponent },
  { path: 'result', component: ExamResultComponent },
  // Courses
  { path: 'coursesdashboard', component: MycoursesComponent },
  { path: 'courselist', component: CourseslistComponent },
  { path: 'coursedetail', component: CoursedetailComponent },
  { path: 'coursepage', component: CoursepageComponent },
  { path: 'coursequiz', component: CoursequizesComponent },

  // Empty Pages
  // Coding Game
  { path: 'coding-game', component: ProblemListComponent },
  { path: 'coding-game/problems', component: ProblemListComponent },
  { path: 'coding-game/problem-detail/:id', component: ProblemDetailComponent },
  { path: 'coding-game/editor/:id', component: CodeEditorComponent },
  { path: 'coding-game/submit/:id', component: SubmissionFormComponent },

  // Forum
  { path: 'blog', component: BlogListComponent },
  { path: 'thread', component: ThreadListComponent },
  { path: 'new', component: ThreadAddComponent },
  { path: 'event', component: EventListComponent },
  { path: 'event/event-detail/:id', component: EventDetailComponent },

  // Marketplace
  { path: 'produitList', component: ListProduitComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order', component: MyOrderComponent },
  { path: 'wishlist', component: ViewWishlistComponent },

  // Donation
  { path: 'Donation', component: DonationComponentComponent },

  // Empty pages
  { path: 'empty', component: EmptypageComponent },
  { path: 'emptyteacher', component: EmptypageteacherComponent },

  // Teacher Routes
  { path: 'teacherhome', component: TeacherlandingpageComponent },
  { path: 'teachercourses', component: TeachercoursesComponent },
  { path: 'teachereditprofile', component: TeachereditprofileComponent },
  { path: 'studentlist', component: StudentslistComponent },
  { path: 'examlist',component:ExamListComponent},
  { path: 'creeaxam',component:ExamFormComponent},
  { path:'certtea',component:CertificateComponent},
  { path: 'editaxam/:idExam',component:ExamEditComponent},
  { path: 'Tutoringsessions', component: TutoringsessionsComponent },
  { path: 'backoffice/Exam/editexama/:idExam',component:ExamadmineditComponent},
  { path:'certificate-listcomponent/:id',component:CertifadmineditComponent},
  { path: 'Tutoringsessions', component: TutoringsessionsComponent },
  { path: 'listTeachers', component: ListTeachersComponent },
  { path: 'Teachers', component: TeachersComponent },

  // Lazy-loaded Back-office Routes
  { path: 'backoffice', loadChildren: () => import('./backend/back-routing.module').then(m => m.BackRoutingModule) },

  // Default Route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Wildcard Routes
  { path: '**', redirectTo: 'studenthome', pathMatch: 'full' }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

