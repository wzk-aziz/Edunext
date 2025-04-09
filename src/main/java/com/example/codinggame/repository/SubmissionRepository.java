package com.example.codinggame.repository;

import com.example.codinggame.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByStudentId(Long studentId);
    // 1. Nombre de soumissions par problème
    @Query("SELECT s.problem.id, COUNT(s) FROM Submission s WHERE s.problem IS NOT NULL GROUP BY s.problem.id")
    List<Object[]> countSubmissionsByProblem();

    @Query("SELECT s.student.id, MAX(s.score) FROM Submission s WHERE s.student IS NOT NULL GROUP BY s.student.id")
    List<Object[]> bestScoreByStudent();

    // 3. Tableau complet trié
    List<Submission> findAllByOrderByScoreDesc();

}
