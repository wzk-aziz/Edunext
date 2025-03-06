import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { BackRoutingModule } from './backend/back-routing.module'; // Import the new module
import { authGuard } from './Shared/services/auth/auth.guard';
import { ListTeachersComponent } from './Shared/list-teachers/list-teachers.component';
import { UpdateUserComponent } from './Shared/update/update.component';
import { TeachersComponent } from './backend/teachers/teachers.component';
import { UsersComponent } from './backend/users/users.component'
import { UserStatsComponent } from './backend/user-stats/user-stats.component';
import { ProfileComponent } from './Shared/profile/profile.component';

const routes: Routes = [
  // Main Landing Page
  { path: 'main', component: MainhomepageComponent, canActivate: [authGuard] },

  // Users
  { path: 'users', component: UsersComponent },
  { path: 'user-stats', component:UserStatsComponent},
  { path: 'profile', component:ProfileComponent},
  
  // Student Routes
  { path: 'studenthome', component: LandigpageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'update', component: UpdateUserComponent },
  { path: 'update/:id', component: UpdateUserComponent },
  { path: 'pricing', component: PacksComponent },
  { path: 'studentdashboard', component: MaindashboardComponent },
  { path: 'myplan', component: SubscriptionComponent },
  { path: 'editprofile', component: EditprofileComponent },

  // Courses
  { path: 'coursesdashboard', component: MycoursesComponent },
  { path: 'courselist', component: CourseslistComponent, },
  { path: 'coursedetail', component: CoursedetailComponent },
  { path: 'coursepage', component: CoursepageComponent },
  { path: 'coursequiz', component: CoursequizesComponent },

  // Empty Pages
  { path: 'empty', component: EmptypageComponent },
  { path: 'emptyteacher', component: EmptypageteacherComponent },

  // Teacher Routes
  { path: 'teacherhome', component: TeacherlandingpageComponent },
  { path: 'teachercourses', component: TeachercoursesComponent },
  { path: 'teachereditprofile', component: TeachereditprofileComponent },
  { path: 'studentlist', component: StudentslistComponent },
  { path: 'Tutoringsessions', component: TutoringsessionsComponent },
  { path: 'listTeachers', component: ListTeachersComponent},
  { path : 'Teachers', component: TeachersComponent},

  // Lazy-loaded Back-office Routes
  { path: 'backoffice', loadChildren: () => import('./backend/back-routing.module').then(m => m.BackRoutingModule) },

  // Default Route
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  // Wildcard Routes
  { path: '**', redirectTo: 'studenthome', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
