import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './Shared/signup/signup.component';
import { SigninComponent } from './Shared/signin/signin.component';
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


import { StudentVirtualClassroomSessionsComponent } from './Student-Pages/student-virtual-classroom-sessions/student-virtual-classroom-sessions.component';

import { StudentLiveClassComponent } from './Student-Pages/student-live-class/student-live-class.component';

import { StudentTutoringComponent } from './Student-Pages/student-tutoring/student-tutoring.component'; 


const routes: Routes = [
  // Main Landing Page
  { path: 'main', component: MainhomepageComponent },
  
  // Student Routes
  { path: 'studenthome', component: LandigpageComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'pricing', component: PacksComponent },
  { path: 'studentdashboard', component: MaindashboardComponent },
  { path: 'myplan', component: SubscriptionComponent },
  { path: 'editprofile', component: EditprofileComponent },

  // Courses
  { path: 'coursesdashboard', component: MycoursesComponent },
  { path: 'courselist', component: CourseslistComponent },
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


  { path: 'student-virtual-classroom-sessions', component: StudentVirtualClassroomSessionsComponent },


  //Live classees 
  { 
    path: 'student-virtual-classroom/:id', component: StudentLiveClassComponent 
  },

  { path: 'student-tutoring', component: StudentTutoringComponent },


  // Lazy-loaded Back-office Routes
  { path: 'backoffice', loadChildren: () => import('./backend/back-routing.module').then(m => m.BackRoutingModule) },

  // Default Route
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  // Wildcard Routes
  { path: '**', redirectTo: 'studenthome', pathMatch: 'full' },

    { path: 'student-virtual-classroom-sessions', component: StudentVirtualClassroomSessionsComponent },





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }