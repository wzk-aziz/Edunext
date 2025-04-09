package com.example.coursesandquizes.Controller;


import com.example.coursesandquizes.Entities.Quiz;
import com.example.coursesandquizes.Service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/quizzes")
public class CourseQuizController {
    private final QuizService quizService;

    public CourseQuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    // Create a new quiz. If courseId is provided (non-null), the quiz is linked to that course.
    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createQuiz(@RequestBody Map<String, Object> payload) {
        try {
            // Extract fields from the payload. You may use a DTO instead.
            String title = (String) payload.get("title");
            String description = (String) payload.get("description");
            Integer timeLimit = (Integer) payload.get("timeLimit");
            Integer totalPoints = (Integer) payload.get("totalPoints");
            Long courseId = payload.get("courseId") != null ? Long.valueOf(payload.get("courseId").toString()) : null;

            Quiz quiz = new Quiz();
            quiz.setTitle(title);
            quiz.setDescription(description);
            quiz.setTimeLimit(timeLimit);
            quiz.setTotalPoints(totalPoints);

            Quiz savedQuiz = quizService.createQuiz(quiz, courseId);
            return ResponseEntity.ok(savedQuiz);
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Retrieve all quizzes
    @GetMapping("/all")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

  @GetMapping("/{id}")
  public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
      Optional<Quiz> quizOpt = quizService.getQuizById(id);
      return quizOpt.map(ResponseEntity::ok)
              .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
  }

    // Update an existing quiz
    @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateQuiz(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        try {
            Quiz quiz = quizService.updateQuiz(id, updatedQuiz);
            return ResponseEntity.ok(quiz);
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a quiz
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
        try {
            quizService.deleteQuiz(id);
            return ResponseEntity.ok("Quiz deleted successfully");
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error deleting quiz: " + e.getMessage()));
        }
    }
}
