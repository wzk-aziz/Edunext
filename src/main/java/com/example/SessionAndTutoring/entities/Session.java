package com.example.SessionAndTutoring.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.Set;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Entity
    public class Session {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long idSession;

        private String titleSession;
        private String sessionSubject;
        private Date startTime;
        private float sessionDuration;

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

        @ManyToMany
        @JoinTable(
                name = "Learner_Session",
                joinColumns = @JoinColumn(name = "session_id"),
                inverseJoinColumns = @JoinColumn(name = "learner_id")
        )
        @JsonIgnore
        private Set<Learner> learners;

        @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonManagedReference
        private Set<Feedback> feedbacks;

        @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonManagedReference
        private Set<ChatMessage> chatMessages;

        @OneToOne(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        private SessionRecording sessionRecording;

        // Minimal required getters and setters
        public void setInstructor(Instructor instructor) {
            this.instructor = instructor;
        }

        public Instructor getInstructor() {
            return instructor;
        }
    }