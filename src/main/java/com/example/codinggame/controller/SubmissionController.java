package com.example.codinggame.controller;

import com.example.codinggame.entity.Submission;
import com.example.codinggame.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    @Autowired
    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    // ✅ Créer une soumission (submit)
    @PostMapping("/submit")
    public ResponseEntity<Submission> submitCode(@RequestBody Submission submission) {
        System.out.println("Received submission: " + submission);
        System.out.println("Git link: " + submission.getGitLink());

        Submission saved = submissionService.create(submission); // utilise bien `create` ici
        return ResponseEntity.ok(saved);
    }

    // 🔍 Obtenir une soumission par ID
    @GetMapping("/{id}")
    public Submission get(@PathVariable Long id) {
        return submissionService.get(id);
    }

    // ✏️ Mettre à jour une soumission
    @PutMapping("/{id}")
    public Submission update(@PathVariable Long id, @RequestBody Submission submission) {
        return submissionService.update(id, submission);
    }

    // ❌ Supprimer une soumission
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        submissionService.delete(id);
    }

    // 📋 Liste des soumissions
    @GetMapping
    public List<Submission> list() {
        return submissionService.list();
    }

    // 🧪 Évaluer une soumission manuellement (pas nécessaire avec `create` mais utile parfois)
    @PutMapping("/{id}/evaluate")
    public Submission evaluate(@PathVariable Long id) {
        return submissionService.evaluate(id);
    }

    // 📊 Statistique : Nombre de soumissions par problème
    @GetMapping("/stats/by-problem")
    public List<Object[]> statsByProblem() {
        return submissionService.getSubmissionsStatsByProblem();
    }

    // 🏆 Statistique : Meilleurs scores par étudiant
    @GetMapping("/stats/best-scores")
    public List<Object[]> bestScores() {
        return submissionService.getBestScoresByStudent();
    }

    // 📈 Statistique : Toutes les soumissions triées par score
    @GetMapping("/stats/all-sorted")
    public ResponseEntity<List<Submission>> getAllSortedByScore() {
        return ResponseEntity.ok(submissionService.getAllSortedByScore());
    }

    // 👤 Soumissions d’un utilisateur spécifique
    @GetMapping("/user/{userId}")
    public List<Submission> getSubmissionsByUser(@PathVariable Long userId) {
        return submissionService.getSubmissionsByUserId(userId);
    }
}
