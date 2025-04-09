package com.esprit.microservice.coursesandquizes.Repository;

import com.esprit.microservice.coursesandquizes.Entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByQuizIdOrderByIdAsc(Long quizId);
}
