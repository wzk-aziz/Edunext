package com.esprit.microservice.coursesandquizes.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // <-- Add this!

public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    private String description;

    // Time limit in minutes
    private Integer timeLimit;

    // Total points for the quiz
    private Integer totalPoints;

    // Optional relation to a Course. If null, the quiz can be taken separately.
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // One Quiz has many Questions.
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // <-- Ensures correct JSON format

    private List<Question> questions;
}
