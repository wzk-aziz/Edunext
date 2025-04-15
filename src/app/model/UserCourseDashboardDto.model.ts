export interface UserLectureDto {
    lectureId: number;
    title: string;
    videoPath: string;
    pdfPath: string;
    videoProgress: number;
    pdfProgress: number;
    note: string;
  }
  
  export interface UserQuizDto {
    quizId: number;
    title: string;
    score: number;
    totalPoints: number;
    timeTaken: number;
    attempted: boolean;
  }
  
  export interface UserCourseDashboardDto {
    courseId: number;
    courseName: string;
    description: string;
    thumbnail: string; // base64 or image URL
    lectures: UserLectureDto[];
    quizzes: UserQuizDto[];
  }
  