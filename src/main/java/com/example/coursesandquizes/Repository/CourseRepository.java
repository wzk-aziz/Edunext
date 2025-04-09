package com.example.coursesandquizes.Repository;


import com.example.coursesandquizes.Entities.Course;
import com.example.coursesandquizes.Entities.Enum.CourseLevel;
import com.example.coursesandquizes.Entities.Enum.PackType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findCourseByCourseName(String courseName);
    List<Course> findByCourseNameContainingIgnoreCase(String courseName);
    List<Course> findByCourseCategory_Id(Long categoryId);
    List<Course> findByCourseLevel(CourseLevel courseLevel);
    List<Course> findByPackType(PackType packType);
}
