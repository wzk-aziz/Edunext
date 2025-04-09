package tn.esprit.tutoring.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGoal;

    private String goalDescription;
    private String goalTargetDate;

@ManyToOne
@JoinColumn(name = "mentorship_program_id")
@JsonIgnore
private MentorshipProgram mentorshipProgram;

@Transient
private Long mentorshipProgramId;

@JsonProperty("mentorshipProgramId")
public Long getMentorshipProgramId() {
    return mentorshipProgram != null ? mentorshipProgram.getIdMentorshipProgram() : mentorshipProgramId;
}

@JsonProperty("mentorshipProgramId")
public void setMentorshipProgramId(Long mentorshipProgramId) {
    this.mentorshipProgramId = mentorshipProgramId;
}
    @Override
    public String toString() {
        return "Goal{" +
                "idGoal=" + idGoal +
                ", goalDescription='" + goalDescription + '\'' +
                ", goalTargetDate='" + goalTargetDate + '\'' +
                ", mentorshipProgramId=" + (mentorshipProgram != null ?
                mentorshipProgram.getIdMentorshipProgram() : null) +
                '}';
    }
}