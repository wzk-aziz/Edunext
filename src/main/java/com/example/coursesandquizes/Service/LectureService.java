package com.example.coursesandquizes.Service;


import com.example.coursesandquizes.Entities.Course;
import com.example.coursesandquizes.Entities.Lecture;
import com.example.coursesandquizes.Repository.CourseRepository;
import com.example.coursesandquizes.Repository.LectureRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@Service
public class LectureService {

    private final LectureRepository lectureRepository;
    private final CourseRepository courseRepository;

    public LectureService(LectureRepository lectureRepository, CourseRepository courseRepository) {
        this.lectureRepository = lectureRepository;
        this.courseRepository = courseRepository;
    }

    // Create a new lecture for a given course
    public Lecture createLecture(Long courseId, String lectureTitle, String lectureDescription, Integer lectureOrder,
                                 MultipartFile pdfFile, MultipartFile videoFile) throws IOException {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        Lecture lecture = new Lecture();
        lecture.setLectureTitle(lectureTitle);
        lecture.setLectureDescription(lectureDescription);
        lecture.setLectureOrder(lectureOrder);
        lecture.setCourse(course);

        // Handle PDF
        if (pdfFile != null && !pdfFile.isEmpty()) {
            if (!pdfFile.getContentType().equals("application/pdf")) {
                throw new IllegalArgumentException("Invalid PDF file");
            }
            String pdfPath = saveFileToDisk(pdfFile, "C:/xampp/htdocs/lecture_uploads/pdfs");
            lecture.setPdfPath(pdfPath);
            lecture.setPdfName(pdfFile.getOriginalFilename());
            lecture.setPdfType(pdfFile.getContentType());
        }

        // Handle Video
        if (videoFile != null && !videoFile.isEmpty()) {
            if (!videoFile.getContentType().startsWith("video/")) {
                throw new IllegalArgumentException("Invalid video file");
            }
            String videoPath = saveFileToDisk(videoFile, "C:/xampp/htdocs/lecture_uploads/videos");
            lecture.setVideoPath(videoPath);
            lecture.setVideoName(videoFile.getOriginalFilename());
            lecture.setVideoType(videoFile.getContentType());
        }

        return lectureRepository.save(lecture);
    }


    // Retrieve lectures for a given course, ordered by lectureOrder
    public List<Lecture> getLecturesByCourseId(Long courseId) {
        return lectureRepository.findByCourseIdOrderByLectureOrderAsc(courseId);
    }

    public Optional<Lecture> getLectureById(Long lectureId) {
        return lectureRepository.findById(lectureId);
    }

    // Update an existing lecture, updating file fields only if a new file is provided.
    public Lecture updateLecture(Long lectureId, String lectureTitle, String lectureDescription, Integer lectureOrder,
                                 MultipartFile pdfFile, MultipartFile videoFile) throws IOException {

        Optional<Lecture> optionalLecture = lectureRepository.findById(lectureId);
        if (optionalLecture.isEmpty()) {
            throw new IllegalArgumentException("Lecture not found");
        }

        Lecture lecture = optionalLecture.get();
        lecture.setLectureTitle(lectureTitle);
        lecture.setLectureDescription(lectureDescription);
        lecture.setLectureOrder(lectureOrder);

        // Update PDF if provided
        if (pdfFile != null && !pdfFile.isEmpty()) {
            if (!pdfFile.getContentType().equals("application/pdf")) {
                throw new IllegalArgumentException("Invalid PDF file");
            }
            String pdfPath = saveFileToDisk(pdfFile, "C:/xampp/htdocs/lecture_uploads/pdfs");
            lecture.setPdfPath(pdfPath);
            lecture.setPdfName(pdfFile.getOriginalFilename());
            lecture.setPdfType(pdfFile.getContentType());
        }

        // Update video if provided
        if (videoFile != null && !videoFile.isEmpty()) {
            if (!videoFile.getContentType().startsWith("video/")) {
                throw new IllegalArgumentException("Invalid video file");
            }
            String videoPath = saveFileToDisk(videoFile, "C:/xampp/htdocs/lecture_uploads/videos");
            lecture.setVideoPath(videoPath);
            lecture.setVideoName(videoFile.getOriginalFilename());
            lecture.setVideoType(videoFile.getContentType());
        }

        return lectureRepository.save(lecture);
    }


    public void deleteLecture(Long lectureId) {
        lectureRepository.deleteById(lectureId);
    }


    private String saveFileToDisk(MultipartFile file, String directory) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Path.of(directory, fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());
        return "http://localhost/lecture_uploads/" + (directory.contains("pdfs") ? "pdfs/" : "videos/") + fileName;
        // Store the full path
    }

}

