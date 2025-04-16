package com.example.codinggame.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {
    private Long id;
    private Integer studentId;
    private String code;
    private Long languageId;
    private String status;
    private String output;
    private Long problemId;
    private String gitLink;
    private int score;
    private long executionTime; // en millisecondes
}