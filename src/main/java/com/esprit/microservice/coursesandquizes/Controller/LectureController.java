package com.esprit.microservice.coursesandquizes.Controller;

import com.esprit.microservice.coursesandquizes.Entities.Lecture;
import com.esprit.microservice.coursesandquizes.Service.LectureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/lectures")
public class LectureController {

    private final LectureService lectureService;

    public LectureController(LectureService lectureService) {
        this.lectureService = lectureService;
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createLecture(
            @RequestParam("courseId") Long courseId,
            @RequestParam("lectureTitle") String lectureTitle,
            @RequestParam("lectureDescription") String lectureDescription,
            @RequestParam("lectureOrder") Integer lectureOrder,
            @RequestParam(value = "pdfFile", required = false) MultipartFile pdfFile,
            @RequestParam(value = "videoFile", required = false) MultipartFile videoFile) {
        try {
            Lecture lecture = lectureService.createLecture(courseId, lectureTitle, lectureDescription, lectureOrder, pdfFile, videoFile);
            return ResponseEntity.ok(lecture);
        } catch(IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "File processing error: " + e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping(value = "/update/{lectureId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateLecture(
            @PathVariable Long lectureId,
            @RequestParam("lectureTitle") String lectureTitle,
            @RequestParam("lectureDescription") String lectureDescription,
            @RequestParam("lectureOrder") Integer lectureOrder,
            @RequestParam(value = "pdfFile", required = false) MultipartFile pdfFile,
            @RequestParam(value = "videoFile", required = false) MultipartFile videoFile) {
        try {
            Lecture updatedLecture = lectureService.updateLecture(lectureId, lectureTitle, lectureDescription, lectureOrder, pdfFile, videoFile);
            return ResponseEntity.ok(updatedLecture);
        } catch(IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "File processing error: " + e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Lecture>> getLecturesByCourse(@PathVariable Long courseId) {
        List<Lecture> lectures = lectureService.getLecturesByCourseId(courseId);
        return ResponseEntity.ok(lectures);
    }

    @GetMapping("/{lectureId}")
    public ResponseEntity<Lecture> getLectureById(@PathVariable Long lectureId) {
        Optional<Lecture> lectureOpt = lectureService.getLectureById(lectureId);
        return lectureOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/delete/{lectureId}")
    public ResponseEntity<?> deleteLecture(@PathVariable Long lectureId) {
        try {
            lectureService.deleteLecture(lectureId);
            return ResponseEntity.ok("Lecture deleted successfully");
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error deleting lecture: " + e.getMessage()));
        }
    }
}
