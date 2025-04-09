package com.esprit.microservice.coursesandquizes.Controller;

import com.esprit.microservice.coursesandquizes.Entities.Question;
import com.esprit.microservice.coursesandquizes.Service.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createQuestions(@RequestBody List<Question> questions) {
        try {
            List<Question> savedQuestions = new ArrayList<>();
            for (Question question : questions) {
                if (question.getQuiz() == null || question.getQuiz().getId() == null) {
                    throw new IllegalArgumentException("Quiz ID is required for each question.");
                }
                Question savedQuestion = questionService.createQuestion(question.getQuiz().getId(), question);
                savedQuestions.add(savedQuestion);
            }
            return ResponseEntity.ok(savedQuestions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }



    // Retrieve all questions for a given quiz, ordered by ID (or custom order if needed)
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<Question>> getQuestionsByQuiz(@PathVariable Long quizId) {
        List<Question> questions = questionService.getQuestionsByQuizId(quizId);
        // Debugging: Print each question and its correct answers
        questions.forEach(q -> System.out.println("Question: " + q.getQuestionText() +
                " | Correct Answers: " + q.getCorrectAnswers()));
        return ResponseEntity.ok(questions);
    }

 @GetMapping("/{id}")
 public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
     Optional<Question> questionOpt = questionService.getQuestionById(id);
     return questionOpt.map(ResponseEntity::ok)
             .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
 }

    // Update an existing question
    @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody Question updatedQuestion) {
        try {
            Question question = questionService.updateQuestion(id, updatedQuestion);
            return ResponseEntity.ok(question);
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a question
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok("Question deleted successfully");
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error deleting question: " + e.getMessage()));
        }
    }
}
