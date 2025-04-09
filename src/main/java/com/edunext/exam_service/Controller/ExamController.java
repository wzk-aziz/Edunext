package com.edunext.exam_service.Controller;

import com.edunext.exam_service.Model.Exam;
import com.edunext.exam_service.Model.Question;
import com.edunext.exam_service.Repository.QuestionRepository;
import com.edunext.exam_service.Service.ExamService;
import com.edunext.exam_service.dto.ExamSubmissionDTO;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:4200")
public class ExamController {
    @Autowired
    ExamService examService;
    @Autowired
    QuestionRepository questionRepository;

    @GetMapping
    public List<Exam> getAllExams() {
        return examService.getAllExams();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable int id) {
        return examService.getExamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Exam createExam(@RequestBody Exam exam) {
        return examService.createExam(exam);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable int id, @RequestBody Exam examDetails) {
        Exam updatedExam = examService.updateExam(id, examDetails);
        return ResponseEntity.ok(updatedExam);
    }
    @DeleteMapping("/{idExam}")
    public ResponseEntity<Void> deleteExam(@PathVariable int idExam) {
        examService.deleteExam(idExam);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/a/{idExam}/questions")
    public ResponseEntity<Exam> addQuestionToExam(@PathVariable int idExam, @RequestBody Question question) {
        Exam updatedExam = examService.addQuestionToExam(idExam, question);
        return ResponseEntity.ok(updatedExam);
    }

    @GetMapping("/ex/{idExam}")
    public ResponseEntity<Exam> getExamWithQuestions(@PathVariable int idExam) {
        Exam exam = examService.getExamWithQuestions(idExam);
        return ResponseEntity.ok(exam);
    }
    @PutMapping("/questions/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question updatedQuestion) {
        // Assurez-vous que l'examen associé est bien chargé et lié à la question
        Optional<Question> existingQuestionOpt = questionRepository.findById(id);
        if (existingQuestionOpt.isPresent()) {
            Question existingQuestion = existingQuestionOpt.get();
            // Mettre à jour les champs de la question (exemple)
            existingQuestion.setQuestionText(updatedQuestion.getQuestionText());
            existingQuestion.setAnswerOptions(updatedQuestion.getAnswerOptions());
            // Garder la relation avec l'examen inchangée (si c'est nécessaire)
            existingQuestion.setExam(existingQuestion.getExam());

            questionRepository.save(existingQuestion);
            return ResponseEntity.ok(existingQuestion);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @GetMapping("/{examId}/questions")
    public ResponseEntity<List<Question>> getQuestions(@PathVariable int examId) {
        return ResponseEntity.ok(examService.getQuestionsForExam(examId));
    }

 /*   @PostMapping("/subm")
    public ResponseEntity<Integer> submitExam(@RequestBody ExamSubmissionDTO submission) {
        int score = examService.correctExam(submission);
        return ResponseEntity.ok(score);
    }*/
 @PostMapping("/submit")
 public ResponseEntity<Integer> submitExam(@RequestBody ExamSubmissionDTO submission) {
     System.out.println("ExamId reçu: " + submission.getExamId());
     System.out.println("Réponses reçues: " + submission.getAnswers());

     // Convertir les clés Integer en Long
     Map<Long, String> convertedAnswers = submission.getAnswers().entrySet().stream()
             .collect(Collectors.toMap(e -> e.getKey().longValue(), Map.Entry::getValue));

     int score = examService.submitExam(submission.getExamId(), convertedAnswers);

     System.out.println("Score retourné: " + score);

     return ResponseEntity.ok(score);
 }
    @GetMapping("/search")
    public List<Exam> searchExams(@RequestParam String title) {
        return examService.searchExamsByTitle(title);
    }
}



