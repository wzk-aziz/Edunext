package com.example.coursesandquizes.Service;


import com.example.coursesandquizes.Entities.CourseCategory;
import com.example.coursesandquizes.Entities.Course;
import com.example.coursesandquizes.Entities.Enum.CourseLevel;
import com.example.coursesandquizes.Entities.Enum.PackType;
import com.example.coursesandquizes.Repository.CourseCategoryRepository;
import com.example.coursesandquizes.Repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseCategoryRepository courseCategoryRepository;

    public CourseService(CourseRepository courseRepository, CourseCategoryRepository courseCategoryRepository) {
        this.courseRepository = courseRepository;
        this.courseCategoryRepository = courseCategoryRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public Optional<Course> getCourseByName(String courseName) {
        return courseRepository.findCourseByCourseName(courseName);
    }

    // Create a new Course without PDF/Video file fields (handled later in Lecture)
    public Course createCourse(String courseName, String courseDescription,
                               Integer pointsEarned, String courseLevel,
                               String packType, Long categoryId,
                               double duration, Integer numberOfLectures,
                               MultipartFile thumbnail) throws IOException {

        Course course = new Course();
        course.setCourseName(courseName);
        course.setCourseDescription(courseDescription);
        course.setPointsEarned(pointsEarned);
        course.setCourseLevel(CourseLevel.valueOf(courseLevel.trim().toUpperCase().replace(" ", "_")));
        course.setPackType(PackType.valueOf(packType.trim().toUpperCase()));

        // Set category
        Optional<CourseCategory> catOpt = courseCategoryRepository.findById(categoryId);
        if (!catOpt.isPresent()) {
            throw new IllegalArgumentException("CourseCategory not found");
        }
        course.setCourseCategory(catOpt.get());

        course.setDuration(duration);
        course.setNumberOfLectures(numberOfLectures);

        // Handle thumbnail (required)
        if (thumbnail.isEmpty()) {
            throw new IllegalArgumentException("Thumbnail is required");
        }
        course.setThumbnailData(thumbnail.getBytes());
        course.setThumbnailFileName(thumbnail.getOriginalFilename());
        course.setThumbnailFileType(thumbnail.getContentType());

        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    // Update an existing Course without PDF/Video file fields.
    public Course updateCourse(Long id, String courseName, String courseDescription,
                               Integer pointsEarned, String courseLevel,
                               String packType, Long categoryId,
                               double duration, Integer numberOfLectures,
                               MultipartFile thumbnail) throws IOException {

        Optional<Course> optionalCourse = courseRepository.findById(id);
        if (!optionalCourse.isPresent()) {
            throw new IllegalArgumentException("Course not found");
        }

        Course course = optionalCourse.get();
        course.setCourseName(courseName);
        course.setCourseDescription(courseDescription);
        course.setPointsEarned(pointsEarned);
        course.setCourseLevel(CourseLevel.valueOf(courseLevel.trim().toUpperCase().replace(" ", "_")));
        course.setPackType(PackType.valueOf(packType.trim().toUpperCase()));

        // Update category
        Optional<CourseCategory> catOpt = courseCategoryRepository.findById(categoryId);
        if (!catOpt.isPresent()) {
            throw new IllegalArgumentException("CourseCategory not found");
        }
        course.setCourseCategory(catOpt.get());

        course.setDuration(duration);
        course.setNumberOfLectures(numberOfLectures);

        if (thumbnail != null && !thumbnail.isEmpty()) {
            course.setThumbnailData(thumbnail.getBytes());
            course.setThumbnailFileName(thumbnail.getOriginalFilename());
            course.setThumbnailFileType(thumbnail.getContentType());
        }

        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }


    public List<Course> getCoursesByName(String courseName) {
        return courseRepository.findByCourseNameContainingIgnoreCase(courseName);
    }

    public List<Course> getCoursesByCategory(Long categoryId) {
        return courseRepository.findByCourseCategory_Id(categoryId);
    }

    public List<Course> getCoursesByCourseLevel(CourseLevel courseLevel) {
        return courseRepository.findByCourseLevel(courseLevel);
    }

    public List<Course> getCoursesByPackType(PackType packType) {
        return courseRepository.findByPackType(packType);
    }

    public Course voteCourse(Long courseId, String vote) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + courseId));

        if ("like".equalsIgnoreCase(vote)) {
            int currentLikes = (course.getLikes() != null) ? course.getLikes() : 0;
            course.setLikes(currentLikes + 1);
        } else if ("dislike".equalsIgnoreCase(vote)) {
            int currentDislikes = (course.getDislikes() != null) ? course.getDislikes() : 0;
            course.setDislikes(currentDislikes + 1);
        } else {
            throw new IllegalArgumentException("Invalid vote type. Must be 'like' or 'dislike'.");
        }

        return courseRepository.save(course);
    }


}
