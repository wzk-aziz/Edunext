import { Category } from './category.model';

export enum PackType {
  COPPER = 'COPPER',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD'
}

export enum CourseFormat {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export enum CourseLevel {
  ALL_LEVELS = 'ALL_LEVELS',
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface Course {
  id?: number;
  courseName: string;
  courseDescription: string;
  courseFormat: CourseFormat;
  courseLevel: CourseLevel;  // New attribute for course level
  pointsEarned: number;
  createdAt?: Date;
  updatedAt?: Date;
  packType: PackType;
  duration: number;           // New field: Duration in hours
  numberOfLectures: number;   // New field: Number of lectures
  // Main file
  fileData?: string;
  fileName?: string;
  fileType?: string;

  // Thumbnail
  thumbnailData?: string;
  thumbnailFileName?: string;
  thumbnailFileType?: string;

  // Files
  pdfData?: string;
  pdfName?: string;
  pdfType?: string;
  
  videoData?: string;
  videoName?: string;
  videoType?: string;


  // Optional: include a full category object if returned from the backend.
  category?: Category;

}
