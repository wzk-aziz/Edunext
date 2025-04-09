package com.example.coursesandquizes.Entities;


import com.example.coursesandquizes.Entities.Enum.CourseFormat;
import com.example.coursesandquizes.Entities.Enum.CourseLevel;
import com.example.coursesandquizes.Entities.Enum.PackType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseName;
    private String courseDescription;

    @Enumerated(EnumType.STRING)
    private CourseFormat courseFormat;

    // New field for course level
    @Enumerated(EnumType.STRING)
    private CourseLevel courseLevel;

    // New pack type field
    @Enumerated(EnumType.STRING)
    private PackType packType;
    // New relationship to CourseCategory


    private Integer pointsEarned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // New fields for course duration (in hours) and number of lectures
    private double duration;  // course duration in hours
    private Integer numberOfLectures;
    // New relationship to CourseCategory


    @ManyToOne
    @JoinColumn(name = "category_id")
    private CourseCategory courseCategory;


    // New relationship: One Course can have many Lectures
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lecture> lectures;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Quiz> quizzes;


    // Thumbnail fields
    @Lob
    private byte[] thumbnailData;
    private String thumbnailFileName;
    private String thumbnailFileType;
//likes
    private Integer likes = 0;
    private Integer dislikes = 0;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    // Helper method: fraction of votes that are likes
    @Transient
    public double getLikeRatio() {
        int l = (likes != null) ? likes : 0;
        int d = (dislikes != null) ? dislikes : 0;
        int total = l + d;
        if (total == 0) {
            return 0.0;
        }
        return (double) l / total;  // ratio in [0.0, 1.0]
    }
}
