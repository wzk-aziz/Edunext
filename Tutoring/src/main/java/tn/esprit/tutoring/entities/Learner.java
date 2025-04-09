package tn.esprit.tutoring.entities;

    import com.fasterxml.jackson.annotation.JsonBackReference;
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
    public class Learner {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long idLearner;
        private String learnerFirstName;
        private String learnerLastName;
        private String learnerEmail;

//        @JsonIgnoreProperties("learners")
        @ManyToMany(mappedBy = "learners")
        private List<MentorshipProgram> mentorshipPrograms;

//        @JsonIgnoreProperties("learner")
        @OneToMany(mappedBy = "learner")
        private List<ProgressReport> progressReports;
    }