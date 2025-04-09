package com.edunext.exam_service.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;
    private String answerOptions; // Tu peux modifier ce type pour une structure plus complexe
    private String correctAnswer;
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;


}

