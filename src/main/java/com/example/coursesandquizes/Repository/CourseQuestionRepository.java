package com.example.coursesandquizes.Repository;


import com.example.coursesandquizes.Entities.CourseQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseQuestionRepository extends JpaRepository<CourseQuestion, Long> {

    List<CourseQuestion> findByQuizIdOrderByIdAsc(Long quizId);
}
