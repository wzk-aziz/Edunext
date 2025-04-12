package tn.esprit.tutoring.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Entity
public class Instructor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInstructor;
    private String instructorFirstName;
    private String instructorLastName;
    private String instructorEmail;


//    @JsonIgnoreProperties
    @OneToMany(mappedBy = "instructor")
    private List<MentorshipProgram> mentorshipPrograms;











}