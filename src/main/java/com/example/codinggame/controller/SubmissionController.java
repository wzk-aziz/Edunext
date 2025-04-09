package com.example.codinggame.controller;

import com.example.codinggame.entity.Submission;
import com.example.codinggame.repository.SubmissionRepository;
import com.example.codinggame.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/submissions")
public class SubmissionController {


    private final SubmissionService submissionService;
    private final SubmissionRepository submissionRepository;

    @Autowired
    public SubmissionController(SubmissionService submissionService,
                                SubmissionRepository submissionRepository) {
        this.submissionService = submissionService;
        this.submissionRepository = submissionRepository;
    }

    @PostMapping
    public Submission create(@RequestBody Submission submission) {
        return submissionService.create(submission);
    }

    @GetMapping("/{id}")
    public Submission get(@PathVariable Long id) {
        return submissionService.get(id);
    }

    @PutMapping("/{id}")
    public Submission update(@PathVariable Long id, @RequestBody Submission submission) {
        return submissionService.update(id, submission);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        submissionService.delete(id);
    }

    @GetMapping
    public List<Submission> list() {
        return submissionService.list();
    }

    /**
     * Endpoint permettant d'évaluer explicitement la soumission
     * en comparant output et expectedOutput.
     */
    @PutMapping("/{id}/evaluate")
    public Submission evaluate(@PathVariable Long id) {
        return submissionService.evaluate(id);
    }

    @PostMapping("/submit")
    public ResponseEntity<Submission> submitCode(@RequestBody Submission submission) {
        submission.setScore(submissionService.calculateScore(submission));
        Submission saved = submissionService.save(submission);
        return ResponseEntity.ok(saved);
    }
    @GetMapping("/user/{userId}")
    public List<Submission> getSubmissionsByUser(@PathVariable Long userId) {
        return submissionRepository.findByStudentId(userId);
    }
    @GetMapping("/stats/by-problem")
    public List<Object[]> statsByProblem() {
        List<Object[]> results = submissionService.getSubmissionsStatsByProblem();
        System.out.println("Stats by problem: " + results.size() + " records found");
        for (Object[] row : results) {
            System.out.println("Problem ID: " + row[0] + ", Count: " + row[1]);
        }
        return results;
    }

    @GetMapping("/stats/best-scores")
    public List<Object[]> bestScores() {
        return submissionService.getBestScoresByStudent();
    }

    @GetMapping("/stats/all-sorted")
    public List<Submission> sortedSubmissions() {
        return submissionService.getAllSortedByScore();
    }



}
