package com.edunext.exam_service.dto;

import java.util.Map;

public class ExamSubmissionDTO {
    public int examId;
    public Long userId;
    public Map<Long, String> answers; // ID question -> Réponse donnée
    // Getter et Setter pour examId
    public int getExamId() {
        return examId;
    }

    public void setExamId(int examId) {
        this.examId = examId;
    }

    // Getter et Setter pour userId
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // Getter et Setter pour answers
    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }

}

