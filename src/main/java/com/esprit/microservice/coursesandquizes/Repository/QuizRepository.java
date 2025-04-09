package com.esprit.microservice.coursesandquizes.Repository;

import com.esprit.microservice.coursesandquizes.Entities.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {


}
