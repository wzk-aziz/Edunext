package tn.esprit.livesessions.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Entity
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idChatMessage;
    private String contentChatMessage;



    @ManyToOne
    @JoinColumn(name = "session_id")
    @JsonBackReference
    private Session session;


  //  private Date timestamp;


    public Long getIdChatMessage() {
        return idChatMessage;
    }

    public void setIdChatMessage(Long idChatMessage) {
        this.idChatMessage = idChatMessage;
    }

//    public Date getTimestamp() {
//        return timestamp;
//    }
//
//    public void setTimestamp(Date timestamp) {
//        this.timestamp = timestamp;
//    }

    public String getContentChatMessage() {
        return contentChatMessage;
    }

    public void setContentChatMessage(String contentChatMessage) {
        this.contentChatMessage = contentChatMessage;
    }
}