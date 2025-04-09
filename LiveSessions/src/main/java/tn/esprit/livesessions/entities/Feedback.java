package tn.esprit.livesessions.entities;

        import com.fasterxml.jackson.annotation.JsonBackReference;
        import com.fasterxml.jackson.annotation.JsonManagedReference;
        import com.fasterxml.jackson.annotation.JsonProperty;
        import jakarta.persistence.*;
        import lombok.*;

        @Getter
        @Setter
        @AllArgsConstructor
        @NoArgsConstructor
        @Builder
        @ToString
        @Entity
        public class Feedback {
            @Id
            @GeneratedValue(strategy = GenerationType.IDENTITY)
            private Long idFeedback;
            private String contentFeedback;
            private int rating;



            @ManyToOne
            @JoinColumn(name = "session_id")
            @JsonBackReference
            private Session session;

            @Transient
            private Long sessionId;

            @JsonProperty("sessionId")
            public Long getSessionId() {
                return session != null ? session.getIdSession() : sessionId;
            }

            @JsonProperty("sessionId")
            public void setSessionId(Long sessionId) {
                this.sessionId = sessionId;
            }






            public Long getIdFeedback() {
                return idFeedback;
            }

            public void setIdFeedback(Long idFeedback) {
                this.idFeedback = idFeedback;
            }

            public int getRating() {
                return rating;
            }

            public void setRating(int rating) {
                this.rating = rating;
            }

            public String getContentFeedback() {
                return contentFeedback;
            }

            public void setContentFeedback(String contentFeedback) {
                this.contentFeedback = contentFeedback;
            }

            // Getters and setters
        }