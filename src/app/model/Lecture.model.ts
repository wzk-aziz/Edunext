export interface Lecture {
    id?: number;
    lectureTitle: string;
    lectureDescription: string;
    lectureOrder: number;
    // File-related fields for the lecture
    pdfPath?: string;
    pdfName?: string;
    pdfType?: string;
  
    videoPath?: string;
    videoName?: string;
    videoType?: string;
    // Relation to course: store just the course ID
    courseId?: number;

    course?: { id: number; courseName?: string; /* ... other course fields */ };
  }
  