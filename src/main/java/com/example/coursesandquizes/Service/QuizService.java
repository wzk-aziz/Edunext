package com.example.coursesandquizes.Service;


import com.example.coursesandquizes.Entities.Course;
import com.example.coursesandquizes.Entities.Quiz;
import com.example.coursesandquizes.Repository.CourseRepository;
import com.example.coursesandquizes.Repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;

    public QuizService(QuizRepository quizRepository, CourseRepository courseRepository) {
        this.quizRepository = quizRepository;
        this.courseRepository = courseRepository;
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    /**
     * Creates a new quiz. If courseId is provided (non-null), the quiz is linked to that course.
     */
    public Quiz createQuiz(Quiz quiz, Long courseId) {
        if (courseId != null) {
            Optional<Course> courseOpt = courseRepository.findById(courseId);
            if (!courseOpt.isPresent()) {
                throw new IllegalArgumentException("Course not found with ID: " + courseId);
            }
            quiz.setCourse(courseOpt.get());
        }
        return quizRepository.save(quiz);
    }

    public Quiz updateQuiz(Long id, Quiz updatedQuiz) {
        Optional<Quiz> quizOpt = quizRepository.findById(id);
        if (!quizOpt.isPresent()) {
            throw new IllegalArgumentException("Quiz not found with ID: " + id);
        }
        Quiz quiz = quizOpt.get();
        quiz.setTitle(updatedQuiz.getTitle());
        quiz.setDescription(updatedQuiz.getDescription());
        quiz.setTimeLimit(updatedQuiz.getTimeLimit());
        quiz.setTotalPoints(updatedQuiz.getTotalPoints());
        // (Questions can be handled separately or cascade update if needed)
        return quizRepository.save(quiz);
    }

    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }
}
