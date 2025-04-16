package com.example.codinggame.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("title")
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }

    @JsonProperty("description")
    @Column(columnDefinition = "TEXT")
    private String description;

    @JsonProperty("expectedOutput")
    @Column(columnDefinition = "TEXT")
    private String expectedOutput;

    // Nouveau champ : temps d’exécution (limite)
    @Column(name = "execution_time_limit")
    private Integer executionTimeLimit;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Submission> submissions;

    @ManyToMany
    @JoinTable(
            name = "problem_language",
            joinColumns = @JoinColumn(name = "problem_id"),
            inverseJoinColumns = @JoinColumn(name = "language_id")
    )
    private Set<Language> languages;

    // Getters et Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public Difficulty getDifficulty() { return difficulty; }

    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getExpectedOutput() { return expectedOutput; }

    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public Integer getExecutionTimeLimit() { return executionTimeLimit; }

    public void setExecutionTimeLimit(Integer executionTimeLimit) { this.executionTimeLimit = executionTimeLimit; }

    public Set<Submission> getSubmissions() { return submissions; }

    public void setSubmissions(Set<Submission> submissions) { this.submissions = submissions; }

    public Set<Language> getLanguages() { return languages; }

    public void setLanguages(Set<Language> languages) { this.languages = languages; }
}
