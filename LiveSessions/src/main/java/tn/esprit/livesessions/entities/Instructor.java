// Instructor.java
package tn.esprit.livesessions.entities;

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
public class Instructor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInstructor;
    private String firstNameInstructor;
    private String lastNameInstructor;
    private String emailInstructor;



    @OneToMany(mappedBy = "instructor")
    private Set<Session> sessions;
}