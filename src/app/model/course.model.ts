import { Category } from './category.model';
import { Lecture } from './Lecture.model';


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
  courseLevel: CourseLevel;
  pointsEarned: number;
  createdAt?: Date;
  updatedAt?: Date;
  packType: PackType;
  duration: number;           // Durée en heures
  numberOfLectures: number;   // Nombre total de leçons dans le cours

  // Champs pour la vignette (aperçu du cours)
  thumbnailData?: string;
  thumbnailFileName?: string;
  thumbnailFileType?: string;

  // Catégorie associée
  category?: Category;

  // Relation avec Lecture : liste des leçons du cours (première option)
  lectures?: Lecture[];

  // New fields for likes and ratings
  likes?: number;
  ratingCount?: number;
  ratingSum?: number;

  // Computed field: average rating (if ratingCount > 0)
  averageRating?: number;

  
}
