import { Component } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TemplateFront';
  showHeader: boolean = true;
  showFooter: boolean = true;
  isTeacherRoute: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        // Check the current route
     //   const isSignUpOrSignInPageOrMainOrBackOffice = event.url.includes('/login') || event.url.includes('/signin') || event.url.includes('/main') || event.url.includes('/backoffice');


        const authRoutes = ['/register', '/login'];
        const isAuthRoute = authRoutes.some(route => event.url === route);

        // Check the current route
        const isSignUpOrSignInPageOrMainOrBackOffice = 
        event.url.includes('/register') ||
         event.url.includes('/login') ||
          event.url.includes('/main') ||
           event.url.includes('/backoffice') ||
            event.url.includes('/update') ||
            event.url.includes('/signup') ||
           event.url.includes('/signin') ;

        this.showHeader = !isSignUpOrSignInPageOrMainOrBackOffice;
        this.showFooter = !isSignUpOrSignInPageOrMainOrBackOffice;

        // Check if the current route is for the teacher
        const teacherRoutes = [
          '/teacherhome',
          '/teachercourses',
          '/teachereditprofile',
          '/studentlist',
          '/Tutoringsessions',

          '/emptyteacher',
          '/creeaxam',
          '/examlist',
          '/editaxam',
          '/certtea'

        ];
        this.isTeacherRoute = teacherRoutes.some(route => event.url.startsWith(route));
      }
    });
  }
}