package com.example.coursesandquizes.Entities;


import com.example.coursesandquizes.Entities.Enum.QuestionType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;

    @Enumerated(EnumType.STRING)
    private QuestionType questionType;

    // List of possible answer options (stored as a separate table)
    @ElementCollection
    private List<String> answerOptions;

    // List of correct answer(s); for SINGLE_CHOICE there should be one element, for MULTIPLE_CHOICE it may be multiple.
    @ElementCollection
    private List<String> correctAnswers;

    // Points awarded for the question.
    private Integer points;

    // Explanation to show after the quiz.
    @Lob
    private String explanation;

    // Many questions belong to one quiz.
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    @JsonBackReference
    private Quiz quiz;
}
