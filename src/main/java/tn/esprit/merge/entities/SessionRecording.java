package tn.esprit.merge.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Entity
public class SessionRecording {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRecording;
    private String urlRecording;



    @OneToOne
    @JoinColumn(name = "session_id")
    private Session session;









   // private LocalDateTime timestampRecording;

    public Long getIdRecording() {
        return idRecording;
    }

    public void setIdRecording(Long idRecording) {
        this.idRecording = idRecording;
    }

//    public LocalDateTime getTimestampRecording() {
//        return timestampRecording;
//    }
//
//    public void setTimestampRecording(LocalDateTime timestampRecording) {
//        this.timestampRecording = timestampRecording;
//    }

    public String getUrlRecording() {
        return urlRecording;
    }

    public void setUrlRecording(String urlRecording) {
        this.urlRecording = urlRecording;
    }


}