package com.esprit.microservice.coursesandquizes.Controller;

import com.esprit.microservice.coursesandquizes.Entities.Course;
import com.esprit.microservice.coursesandquizes.Entities.Enum.CourseLevel;
import com.esprit.microservice.coursesandquizes.Entities.Enum.PackType;
import com.esprit.microservice.coursesandquizes.Service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/all")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> courseOpt = courseService.getCourseById(id);
        return courseOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping(value="/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createCourse(
            @RequestParam("courseName") String courseName,
            @RequestParam("courseDescription") String courseDescription,
            @RequestParam("pointsEarned") Integer pointsEarned,
            @RequestParam("courseLevel") String courseLevel,
            @RequestParam("packType") String packType,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("duration") double duration,
            @RequestParam("numberOfLectures") Integer numberOfLectures,
            @RequestParam("thumbnail") MultipartFile thumbnail) {
        try {
            Course course = courseService.createCourse(
                    courseName, courseDescription, pointsEarned, courseLevel, packType, categoryId,
                    duration, numberOfLectures, thumbnail);
            return ResponseEntity.ok(course);
        } catch(IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "File processing error: " + e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping(value="/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCourse(
            @PathVariable Long id,
            @RequestParam("courseName") String courseName,
            @RequestParam("courseDescription") String courseDescription,
            @RequestParam("pointsEarned") Integer pointsEarned,
            @RequestParam("courseLevel") String courseLevel,
            @RequestParam("packType") String packType,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("duration") double duration,
            @RequestParam("numberOfLectures") Integer numberOfLectures,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail) {
        try {
            Course updated = courseService.updateCourse(
                    id, courseName, courseDescription, pointsEarned, courseLevel, packType, categoryId,
                    duration, numberOfLectures, thumbnail);
            return ResponseEntity.ok(updated);
        } catch(IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "File processing error: " + e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok("Course deleted successfully");
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error deleting course: " + e.getMessage()));
        }
    }

    @GetMapping("/search/by-name")
    public ResponseEntity<List<Course>> getCoursesByName(@RequestParam String name) {
        List<Course> courses = courseService.getCoursesByName(name);
        return ResponseEntity.ok(courses);
    }

@GetMapping("/search/by-category")
public ResponseEntity<List<Course>> getCoursesByCategory(@RequestParam Long categoryId) {
    List<Course> courses = courseService.getCoursesByCategory(categoryId);
    return ResponseEntity.ok(courses);
}

@GetMapping("/search/by-course-level")
public ResponseEntity<List<Course>> getCoursesByCourseLevel(@RequestParam CourseLevel courseLevel) {
    List<Course> courses = courseService.getCoursesByCourseLevel(courseLevel);
    return ResponseEntity.ok(courses);
}

@GetMapping("/search/by-pack-type")
public ResponseEntity<List<Course>> getCoursesByPackType(@RequestParam PackType packType) {
    List<Course> courses = courseService.getCoursesByPackType(packType);
    return ResponseEntity.ok(courses);
}


    @PostMapping("/{id}/vote")
    public ResponseEntity<?> voteCourse(@PathVariable Long id, @RequestParam String vote) {
        try {
            Course updated = courseService.voteCourse(id, vote);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
