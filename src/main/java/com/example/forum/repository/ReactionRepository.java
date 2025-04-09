package com.example.forum.repository;

import com.example.forum.entity.Reaction;
import com.example.forum.entity.ReactionType;
import com.example.forum.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    List<Reaction> findByBlog_Id(Long blogId);
    List<Reaction> findByThread_Id(Long threadId);
    List<Reaction> findByStudentEmail(String studentEmail);
    Long countByThread_IdAndType(Long threadId, ReactionType type);
    boolean existsByThread_IdAndStudentEmailAndType(Long threadId, String email, ReactionType type);
    Optional<Reaction> findByThread_IdAndStudentEmailAndType(Long threadId, String email, ReactionType type);
    List<Reaction> findByThread_IdAndType(Long threadId, ReactionType type);
}