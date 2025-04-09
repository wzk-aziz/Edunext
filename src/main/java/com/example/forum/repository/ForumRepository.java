package com.example.forum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.forum.entity.Forum;
import org.springframework.stereotype.Repository;


@Repository
public interface ForumRepository extends JpaRepository<Forum, Long> {
}