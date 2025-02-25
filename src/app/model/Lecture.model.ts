export interface Lecture {
    id?: number;
    lectureTitle: string;
    lectureDescription: string;
    lectureOrder: number;
    // File-related fields for the lecture
    pdfData?: string;
    pdfName?: string;
    pdfType?: string;
    videoData?: string;
    videoName?: string;
    videoType?: string;
    // Relation to course: store just the course ID
    courseId?: number;
  }
  