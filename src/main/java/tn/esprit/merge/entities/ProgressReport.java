package tn.esprit.merge.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReport;

    private String reportContent;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date reportDate;

    @ManyToOne
    @JoinColumn(name = "mentorship_program_id")
    @JsonIgnore
    private MentorshipProgram mentorshipProgram;

    @ManyToOne
    @JoinColumn(name = "learner_id")
    @JsonIgnore
    private Learner learner;

    @Transient
    private Long mentorshipProgramId;

    @Transient
    private Long learnerId;

    @JsonProperty("mentorshipProgramId")
    public Long getMentorshipProgramId() {
        return mentorshipProgram != null ? mentorshipProgram.getIdMentorshipProgram() : mentorshipProgramId;
    }

    @JsonProperty("mentorshipProgramId")
    public void setMentorshipProgramId(Long id) {
        this.mentorshipProgramId = id;
    }

    @JsonProperty("learnerId")
    public Long getLearnerId() {
        return learner != null ? learner.getIdLearner() : learnerId;
    }

    @JsonProperty("learnerId")
    public void setLearnerId(Long id) {
        this.learnerId = id;
    }

    @Override
    public String toString() {
        return "ProgressReport{" +
                "idReport=" + idReport +
                ", reportContent='" + reportContent + '\'' +
                ", reportDate=" + reportDate +
                ", mentorshipProgramId=" + getMentorshipProgramId() +
                ", learnerId=" + getLearnerId() +
                '}';
    }
}