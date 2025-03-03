package com.edunext.exam_service.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Certificate implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String recipientName;
    private LocalDate issueDate;

   /* @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;*/



}
