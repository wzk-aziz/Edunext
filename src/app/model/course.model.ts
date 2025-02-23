
export enum CourseFormat {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}


export interface Course {
  id?: number;
  courseName: string;
  courseDescription: string;
  courseFormat: CourseFormat;
  pointsEarned: number;
  createdAt?: Date;
  updatedAt?: Date;

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
 
}