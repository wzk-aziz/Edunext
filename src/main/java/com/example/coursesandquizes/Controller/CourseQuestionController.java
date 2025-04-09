package com.example.coursesandquizes.Controller;


import com.example.coursesandquizes.Entities.CourseQuestion;
import com.example.coursesandquizes.Service.CourseQuestionService;
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
public class CourseQuestionController {
    private final CourseQuestionService questionService;

    public CourseQuestionController(CourseQuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createQuestions(@RequestBody List<CourseQuestion> courseQuestions) {
        try {
            List<CourseQuestion> savedCourseQuestions = new ArrayList<>();
            for (CourseQuestion courseQuestion : courseQuestions) {
                if (courseQuestion.getQuiz() == null || courseQuestion.getQuiz().getId() == null) {
                    throw new IllegalArgumentException("Quiz ID is required for each courseQuestion.");
                }
                CourseQuestion savedCourseQuestion = questionService.createQuestion(courseQuestion.getQuiz().getId(), courseQuestion);
                savedCourseQuestions.add(savedCourseQuestion);
            }
            return ResponseEntity.ok(savedCourseQuestions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }



    // Retrieve all questions for a given quiz, ordered by ID (or custom order if needed)
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<CourseQuestion>> getQuestionsByQuiz(@PathVariable Long quizId) {
        List<CourseQuestion> courseQuestions = questionService.getQuestionsByQuizId(quizId);
        // Debugging: Print each question and its correct answers
        courseQuestions.forEach(q -> System.out.println("CourseQuestion: " + q.getQuestionText() +
                " | Correct Answers: " + q.getCorrectAnswers()));
        return ResponseEntity.ok(courseQuestions);
    }

 @GetMapping("/{id}")
 public ResponseEntity<CourseQuestion> getQuestionById(@PathVariable Long id) {
     Optional<CourseQuestion> questionOpt = questionService.getQuestionById(id);
     return questionOpt.map(ResponseEntity::ok)
             .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
 }

    // Update an existing question
    @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody CourseQuestion updatedCourseQuestion) {
        try {
            CourseQuestion courseQuestion = questionService.updateQuestion(id, updatedCourseQuestion);
            return ResponseEntity.ok(courseQuestion);
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a question
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok("CourseQuestion deleted successfully");
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error deleting question: " + e.getMessage()));
        }
    }
}
