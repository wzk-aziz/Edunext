package com.example.coursesandquizes.Service;


import com.example.coursesandquizes.Entities.CourseQuestion;
import com.example.coursesandquizes.Entities.Quiz;
import com.example.coursesandquizes.Repository.CourseQuestionRepository;
import com.example.coursesandquizes.Repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseQuestionService {
    private final CourseQuestionRepository courseQuestionRepository;
    private final QuizRepository quizRepository;

    public CourseQuestionService(CourseQuestionRepository courseQuestionRepository, QuizRepository quizRepository) {
        this.courseQuestionRepository = courseQuestionRepository;
        this.quizRepository = quizRepository;
    }

    public List<CourseQuestion> getQuestionsByQuizId(Long quizId) {
        // Assuming a repository method that sorts by lecture order (or question order)
        return courseQuestionRepository.findByQuizIdOrderByIdAsc(quizId);
    }

    public Optional<CourseQuestion> getQuestionById(Long id) {
        return courseQuestionRepository.findById(id);
    }

    /**
     * Creates a new courseQuestion and associates it with the quiz identified by quizId.
     */
    public CourseQuestion createQuestion(Long quizId, CourseQuestion courseQuestion) {
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (!quizOpt.isPresent()) {
            throw new IllegalArgumentException("Quiz not found with ID: " + quizId);
        }
        courseQuestion.setQuiz(quizOpt.get());
        return courseQuestionRepository.save(courseQuestion);
    }

    public CourseQuestion updateQuestion(Long id, CourseQuestion updatedCourseQuestion) {
        Optional<CourseQuestion> questionOpt = courseQuestionRepository.findById(id);
        if (!questionOpt.isPresent()) {
            throw new IllegalArgumentException("CourseQuestion not found with ID: " + id);
        }
        CourseQuestion courseQuestion = questionOpt.get();
        courseQuestion.setQuestionText(updatedCourseQuestion.getQuestionText());
        courseQuestion.setQuestionType(updatedCourseQuestion.getQuestionType());
        courseQuestion.setAnswerOptions(updatedCourseQuestion.getAnswerOptions());
        courseQuestion.setCorrectAnswers(updatedCourseQuestion.getCorrectAnswers());
        courseQuestion.setPoints(updatedCourseQuestion.getPoints());
        courseQuestion.setExplanation(updatedCourseQuestion.getExplanation());
        return courseQuestionRepository.save(courseQuestion);
    }

    public void deleteQuestion(Long id) {
        courseQuestionRepository.deleteById(id);
    }
}
