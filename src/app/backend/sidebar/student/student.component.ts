import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Shared/services/user/user.service';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  students: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.userService.getUsersByRole('LEARNER').subscribe(data => {
      this.students = data;
    });
  }
}
