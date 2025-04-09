package com.example.coursesandquizes.Entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Lecture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String lectureTitle;
    private String lectureDescription;
    private Integer lectureOrder; // Order number within the course


    private String pdfPath;
    private String pdfName;
    private String pdfType;

    private String videoPath;
    private String videoName;
    private String videoType;

    // Many lectures belong to one course
    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnore
    private Course course;
}
