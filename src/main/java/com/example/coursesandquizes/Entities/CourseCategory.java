package com.example.coursesandquizes.Entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;       // e.g., "Development", "Business", etc.
    @JsonIgnore
    @OneToMany(mappedBy = "courseCategory", cascade = CascadeType.ALL)
    private List<Course> courses;

}
