package com.example.SessionAndTutoring.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class MentorshipProgram {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMentorshipProgram;
    private String programName;
    private String programDescription;
    private Date programStartDate;
    private Date programEndDate;
    private String programSubject;
    private float programPrice;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    @JsonIgnore
    private Instructor instructor;

    @Transient
    private Long instructorId;

    @JsonProperty("instructorId")
    public Long getInstructorId() {
        return instructor != null ? instructor.getIdInstructor() : instructorId;
    }

    @JsonProperty("instructorId")
    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }

    @OneToMany(mappedBy = "mentorshipProgram")
    @JsonIgnore
    private List<ProgressReport> progressReports;

    @ManyToMany
    @JoinTable(
            name = "mentorship_program_learner",
            joinColumns = @JoinColumn(name = "mentorship_program_id"),
            inverseJoinColumns = @JoinColumn(name = "learner_id")
    )
    @JsonIgnore
    private List<Learner> learners;

    @OneToMany(mappedBy = "mentorshipProgram", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Goal> goals;

    @Override
    public String toString() {
        return "MentorshipProgram{" +
                "idMentorshipProgram=" + idMentorshipProgram +
                ", programName='" + programName + '\'' +
                ", programDescription='" + programDescription + '\'' +
                ", programSubject='" + programSubject + '\'' +
                ", programPrice=" + programPrice +
                '}';
    }
}