package com.example.forum.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.forum.entity.Thread;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreadRepository extends JpaRepository<Thread, Long> {
    List<Thread> findByForumIdForum(Long forumId);
}