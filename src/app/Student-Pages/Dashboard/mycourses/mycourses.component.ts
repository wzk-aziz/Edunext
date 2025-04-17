import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/backend/courses/Services/course.service';
import { LectureService } from 'src/app/backend/courses/Services/lecture.service';
import { Category } from 'src/app/model/category.model';
import { Course } from 'src/app/model/course.model';
import { Lecture } from 'src/app/model/Lecture.model';

@Component({
  selector: 'app-mycourses',
  templateUrl: './mycourses.component.html',
  styleUrls: ['./mycourses.component.css']
})
export class MycoursesComponent implements OnInit {
  courseProgressList: Array<{
    id: number;
    name: string;
    category?: Category;
    level: string;
    thumbnail: string;
    progress: number;
    totalLectures: number;
    completedLectures: number;
  }> = [];

  averageCourseProgress: number = 0;
  recommendedCourses: Course[] = [];
  allCourses: Course[] = [];

  constructor(
    private courseService: CourseService,
    private lectureService: LectureService
  ) {}

  ngOnInit(): void {
    this.loadCoursesWithProgress();
  }

  async loadCoursesWithProgress(): Promise<void> {
    const courses: Course[] = (await this.courseService.getAllCourses().toPromise()) || [];
    this.allCourses = courses;

    let overallProgressSum = 0;

    for (const course of courses) {
      const lectures: Lecture[] = (await this.lectureService.getLecturesByCourseId(course.id!).toPromise()) || [];

      if (lectures.length === 0) continue;

      let totalProgress = 0;
      let completedLectures = 0;

      for (const lecture of lectures) {
        const videoKey = `lecture_video_progress_${lecture.id}`;
        const pdfKey = `lecture_pdf_progress_${lecture.id}`;

        const videoProgress = parseInt(localStorage.getItem(videoKey) || '0', 10);
        const pdfProgress = parseInt(localStorage.getItem(pdfKey) || '0', 10);

        let lectureProgress = 0;
        if (lecture.videoPath && lecture.pdfPath) {
          lectureProgress = Math.floor((videoProgress + pdfProgress) / 2);
        } else if (lecture.videoPath) {
          lectureProgress = videoProgress;
        } else if (lecture.pdfPath) {
          lectureProgress = pdfProgress;
        }

        totalProgress += lectureProgress;

        if (lectureProgress >= 99) {
          completedLectures++;
        }
      }

      const avgProgress = Math.floor(totalProgress / lectures.length);
      const finalProgress = avgProgress >= 99 ? 100 : avgProgress;

      this.courseProgressList.push({
        id: course.id!,
        name: course.courseName,
        level: course.courseLevel,
        thumbnail: course.thumbnailData || '',
        category: course.category,
        progress: finalProgress,
        totalLectures: lectures.length,
        completedLectures: completedLectures
      });

      overallProgressSum += finalProgress;
    }

    this.averageCourseProgress = this.courseProgressList.length > 0
      ? Math.floor(overallProgressSum / this.courseProgressList.length)
      : 0;

    this.generateRecommendations();
  }

  generateRecommendations(): void {
    const completedIds = this.courseProgressList.map(c => c.id);
    const topCategories = this.courseProgressList
      .map(c => c.category?.id)
      .filter((id, index, arr) => id !== undefined && arr.indexOf(id) === index);

    this.recommendedCourses = this.allCourses
      .filter(c =>
        !completedIds.includes(c.id!) &&
        topCategories.includes(c.category?.id)
      )
      .slice(0, 3);
  }

  getTotalCompletedLessons(): number {
    return this.courseProgressList.reduce((total, course: any) => {
      return total + (course.completedLectures || 0);
    }, 0);
  }
}
