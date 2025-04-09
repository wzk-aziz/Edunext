package com.example.SessionAndTutoring.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Entity
public class Learner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLearner;
    private String firstNameLearner;
    private String lastNameLearner;
    private String emailLearner;



    @ManyToMany(mappedBy = "learners")
    private Set<Session> sessions;






}