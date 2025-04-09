package com.esprit.microservice.coursesandquizes.Repository;

import com.esprit.microservice.coursesandquizes.Entities.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
    // Retrieve lectures for a given course, ordered by lectureOrder
    List<Lecture> findByCourseIdOrderByLectureOrderAsc(Long courseId);
    
}