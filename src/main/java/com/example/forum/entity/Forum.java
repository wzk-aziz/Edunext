//package com.example.forum.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import lombok.experimental.FieldDefaults;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.util.List;
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import com.fasterxml.jackson.annotation.JsonProperty;
//@Entity
//@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder @ToString
//@FieldDefaults(level = AccessLevel.PRIVATE)
//public class Forum {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @JsonProperty("id")
//    private Long idForum;
//
//    @JsonProperty("forumTitle")
//    private String forumTitle;
//
//    @JsonProperty("forumDescription")
//    private String forumDescription;
//
//
//
//
//
//    @OneToOne
//    @JoinColumn(name = "blog_id")
//    private Blog blog;
//
//    public Long getIdForum() {
//        return idForum;
//    }
//
//    public void setIdForum(Long idForum) {
//        this.idForum = idForum;
//    }
//
//    public String getForumTitle() {
//        return forumTitle;
//    }
//
//    public void setForumTitle(String forumTitle) {
//        this.forumTitle = forumTitle;
//    }
//
//    public String getForumDescription() {
//        return forumDescription;
//    }
//
//    public void setForumDescription(String forumDescription) {
//        this.forumDescription = forumDescription;
//    }
//
//
//
//    public Blog getBlog() {
//        return blog;
//    }
//
//    public void setBlog(Blog blog) {
//        this.blog = blog;
//    }
//}
package com.example.forum.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
@Builder @ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Forum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long idForum;

    String forumTitle;
    String forumDescription;

    @OneToMany(mappedBy = "forum", cascade = CascadeType.ALL)
    @JsonIgnore
    List<Thread> threads;

    @OneToMany(mappedBy = "forum", cascade = CascadeType.ALL)
    @JsonIgnore
    List<Blog> blogs;

    @OneToMany(mappedBy = "forum", cascade = CascadeType.ALL)
    @JsonIgnore
    List<Event> events;

    public Long getIdForum() {
        return idForum;
    }

    public void setIdForum(Long idForum) {
        this.idForum = idForum;
    }

    public String getForumTitle() {
        return forumTitle;
    }

    public void setForumTitle(String forumTitle) {
        this.forumTitle = forumTitle;
    }

    public String getForumDescription() {
        return forumDescription;
    }

    public void setForumDescription(String forumDescription) {
        this.forumDescription = forumDescription;
    }

    public List<Thread> getThreads() {
        return threads;
    }

    public void setThreads(List<Thread> threads) {
        this.threads = threads;
    }

    public List<Blog> getBlogs() {
        return blogs;
    }

    public void setBlogs(List<Blog> blogs) {
        this.blogs = blogs;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }
}
