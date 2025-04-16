package com.example.codinggame.entity;

import com.example.EduNext.Entities.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @JsonProperty("code")
    @Column(columnDefinition = "TEXT")
    private String code;

    @ManyToOne
    @JoinColumn(name = "language_id", referencedColumnName = "id")
    private Language language;

    @JsonProperty("status")
    private String status;

    @JsonProperty("output")
    @Column(columnDefinition = "TEXT")
    private String output;

    @ManyToOne
    @JoinColumn(name = "problem_id", referencedColumnName = "id")
    @JsonBackReference
    private Problem problem;

    @Column(name = "git_link")
    private String gitLink;

    @Column(name = "score")
    private int score;

    @Column(name = "execution_time")
    private long executionTime; // en millisecondes

    @Column(name = "creation_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate = new Date();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }

    public String getGitLink() { return gitLink; }
    public void setGitLink(String gitLink) { this.gitLink = gitLink; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public long getExecutionTime() { return executionTime; }
    public void setExecutionTime(long executionTime) { this.executionTime = executionTime; }

    public Date getCreationDate() { return creationDate; }
    public void setCreationDate(Date creationDate) { this.creationDate = creationDate; }
}