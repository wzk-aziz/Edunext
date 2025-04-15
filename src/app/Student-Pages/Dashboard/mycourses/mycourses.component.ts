import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/backend/courses/Services/course.service';
import { LectureService } from 'src/app/backend/courses/Services/lecture.service';
import { Category } from 'src/app/model/category.model';
import { Course } from 'src/app/model/course.model';
import { Lecture } from 'src/app/model/Lecture.model';
import { UserCourseDashboardDto } from 'src/app/model/UserCourseDashboardDto.model';

@Component({
  selector: 'app-mycourses',
  templateUrl: './mycourses.component.html',
  styleUrls: ['./mycourses.component.css']
})
export class MycoursesComponent implements OnInit {
  courseProgressList: Array<{
    id: number;
    name: string;
    thumbnail: string;
    progress: number;
    totalLectures: number;
    completedLectures: number;
  }> = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadUserCourses();
  }

  loadUserCourses(): void {
    this.courseService.getUserCourses().subscribe((userCourses: UserCourseDashboardDto[]) => {
      this.courseProgressList = userCourses.map(course => {
        const completedLectures = course.lectures.filter(l =>
          ((l.videoProgress ?? 0) + (l.pdfProgress ?? 0)) / (l.videoPath && l.pdfPath ? 2 : 1) >= 99
        ).length;

        const totalLectures = course.lectures.length;
        const totalProgress = course.lectures.reduce((sum, l) => {
          if (l.videoPath && l.pdfPath) {
            return sum + ((l.videoProgress ?? 0 + l.pdfProgress ?? 0) / 2);
          } else if (l.videoPath) {
            return sum + (l.videoProgress ?? 0);
          } else if (l.pdfPath) {
            return sum + (l.pdfProgress ?? 0);
          } else {
            return sum;
          }
        }, 0);

        const avgProgress = Math.floor(totalProgress / totalLectures);
        const finalProgress = avgProgress >= 99 ? 100 : avgProgress;

        return {
          id: course.courseId,
          name: course.courseName,
          thumbnail: course.thumbnail,
          progress: finalProgress,
          totalLectures,
          completedLectures
        };
      });
    });
  }

  getTotalCompletedLessons(): number {
    return this.courseProgressList.reduce((total, course) => total + (course.completedLectures || 0), 0);
  }
}