package com.example.codinggame.service;

import com.example.codinggame.entity.Submission;
import com.example.codinggame.entity.Language;
import com.example.codinggame.entity.Problem;
import com.example.codinggame.repository.SubmissionRepository;
import com.example.codinggame.repository.LanguageRepository;
import com.example.codinggame.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final LanguageRepository languageRepository;
    private final ProblemRepository problemRepository;

    @Autowired
    public SubmissionService(SubmissionRepository submissionRepository,
                             LanguageRepository languageRepository,
                             ProblemRepository problemRepository) {
        this.submissionRepository = submissionRepository;
        this.languageRepository = languageRepository;
        this.problemRepository = problemRepository;
    }

    public Submission create(Submission submission) {
        if (submission.getLanguage() != null && submission.getLanguage().getId() != null) {
            Language lang = languageRepository
                    .findById(submission.getLanguage().getId())
                    .orElseThrow(() -> new RuntimeException("Language not found!"));
            submission.setLanguage(lang);
        }

        if (submission.getProblem() != null && submission.getProblem().getId() != null) {
            Problem prob = problemRepository
                    .findById(submission.getProblem().getId())
                    .orElseThrow(() -> new RuntimeException("Problem not found!"));
            submission.setProblem(prob);
        }

        return submissionRepository.save(submission);
    }

    public Submission get(Long id) {
        return submissionRepository.findById(id).orElse(null);
    }

    public Submission update(Long id, Submission submission) {
        if (!submissionRepository.existsById(id)) {
            return null;
        }

        Submission existing = submissionRepository.getReferenceById(id);

        existing.setCode(submission.getCode());
        existing.setStatus(submission.getStatus());
        existing.setOutput(submission.getOutput());

        if (submission.getLanguage() != null && submission.getLanguage().getId() != null) {
            Language lang = languageRepository
                    .findById(submission.getLanguage().getId())
                    .orElseThrow(() -> new RuntimeException("Language not found!"));
            existing.setLanguage(lang);
        } else {
            existing.setLanguage(null);
        }

        if (submission.getProblem() != null && submission.getProblem().getId() != null) {
            Problem prob = problemRepository
                    .findById(submission.getProblem().getId())
                    .orElseThrow(() -> new RuntimeException("Problem not found!"));
            existing.setProblem(prob);
        } else {
            existing.setProblem(null);
        }

        return submissionRepository.save(existing);
    }

    public void delete(Long id) {
        submissionRepository.deleteById(id);
    }

    public List<Submission> list() {
        return submissionRepository.findAll();
    }

    public Submission evaluate(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found!"));
        evaluateSubmission(submission);
        return submissionRepository.save(submission);
    }

    public int calculateScore(Submission submission) {
        String code = submission.getCode();
        return (code != null && code.contains("return")) ? 100 : 50;
    }

    public Submission save(Submission submission) {
        return submissionRepository.save(submission);
    }

    private void evaluateSubmission(Submission submission) {
        if (submission.getProblem() == null) {
            submission.setStatus("NO_PROBLEM");
            return;
        }
        String expected = submission.getProblem().getExpectedOutput();
        String actual = submission.getOutput();
        if (expected == null || expected.isBlank()) {
            submission.setStatus("NO_EXPECTED_OUTPUT");
        } else if (expected.equals(actual)) {
            submission.setStatus("ACCEPTED");
        } else {
            submission.setStatus("WRONG_ANSWER");
        }
    }

    public List<Object[]> getSubmissionsStatsByProblem() {
        return submissionRepository.countSubmissionsByProblem();
    }

    public List<Object[]> getBestScoresByStudent() {
        return submissionRepository.bestScoreByStudent();
    }

    public List<Submission> getAllSortedByScore() {
        return submissionRepository.findAllByOrderByScoreDesc();
    }

    public List<Submission> getSubmissionsByUserId(Long userId) {
        return submissionRepository.findByStudentId(userId);
    }
}
