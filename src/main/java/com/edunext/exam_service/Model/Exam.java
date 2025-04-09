package com.edunext.exam_service.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Exam implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int idExam;
    private String examTitle;
    private String examDescription;
    private int examDuration;
    private int totalMarks;
    private int passingScore;
    private LocalDate scheduledDate;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Question> questions = new ArrayList<>();

  /* @OneToMany(mappedBy = "exam")
    private List<Certificate> certificates;*/
}
