package com.example.forum.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
@Builder @ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
@Schema(description = "Reaction entity representing likes and dislikes on blogs or threads")
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique ID of the reaction", example = "1")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "blog_id")
    @JsonIgnore // Évite la boucle infinie lors de la sérialisation
    @Schema(description = "Associated blog (nullable if reaction is for a thread)")
    private Blog blog;

    @ManyToOne
    @JoinColumn(name = "thread_id")
    @JsonIgnore
    @Schema(description = "Associated thread (nullable if reaction is for a blog)")
    private Thread thread;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Type of reaction", example = "LIKE")
    private ReactionType type;

    @Column(nullable = false)
    @Schema(description = "Email of the student who reacted", example = "student@example.com")
    private String studentEmail;

    // AJOUTER CE CHAMP :
    @Column(name = "content", length = 2000)
    String content;
    public void setContent(String content) {
        this.content = content;
    }

    public String getContent() {
        return this.content;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Blog getBlog() {
        return blog;
    }

    public void setBlog(Blog blog) {
        this.blog = blog;
    }

    public Thread getThread() {
        return thread;
    }

    public void setThread(Thread thread) {
        this.thread = thread;
    }

    public ReactionType getType() {
        return type;
    }

    public void setType(ReactionType type) {
        this.type = type;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public void setBlogId(Long blogId) {
        if (blogId != null) {
            Blog blog = new Blog();
            blog.setId(blogId);
            this.blog = blog;
        } else {
            this.blog = null;
        }
    }

    public void setThreadId(Long threadId) {
        if (threadId != null) {
            Thread thread = new Thread();
            thread.setId(threadId);
            this.thread = thread;
        } else {
            this.thread = null;
        }
    }


}
