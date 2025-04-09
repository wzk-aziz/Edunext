package com.example.SessionAndTutoring.repositories;

import com.example.SessionAndTutoring.entities.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {
}