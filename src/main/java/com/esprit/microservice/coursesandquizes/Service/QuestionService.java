package com.esprit.microservice.coursesandquizes.Service;

import com.esprit.microservice.coursesandquizes.Entities.Question;
import com.esprit.microservice.coursesandquizes.Entities.Quiz;
import com.esprit.microservice.coursesandquizes.Repository.QuestionRepository;
import com.esprit.microservice.coursesandquizes.Repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    public QuestionService(QuestionRepository questionRepository, QuizRepository quizRepository) {
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
    }

    public List<Question> getQuestionsByQuizId(Long quizId) {
        // Assuming a repository method that sorts by lecture order (or question order)
        return questionRepository.findByQuizIdOrderByIdAsc(quizId);
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    /**
     * Creates a new question and associates it with the quiz identified by quizId.
     */
    public Question createQuestion(Long quizId, Question question) {
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (!quizOpt.isPresent()) {
            throw new IllegalArgumentException("Quiz not found with ID: " + quizId);
        }
        question.setQuiz(quizOpt.get());
        return questionRepository.save(question);
    }

    public Question updateQuestion(Long id, Question updatedQuestion) {
        Optional<Question> questionOpt = questionRepository.findById(id);
        if (!questionOpt.isPresent()) {
            throw new IllegalArgumentException("Question not found with ID: " + id);
        }
        Question question = questionOpt.get();
        question.setQuestionText(updatedQuestion.getQuestionText());
        question.setQuestionType(updatedQuestion.getQuestionType());
        question.setAnswerOptions(updatedQuestion.getAnswerOptions());
        question.setCorrectAnswers(updatedQuestion.getCorrectAnswers());
        question.setPoints(updatedQuestion.getPoints());
        question.setExplanation(updatedQuestion.getExplanation());
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}
