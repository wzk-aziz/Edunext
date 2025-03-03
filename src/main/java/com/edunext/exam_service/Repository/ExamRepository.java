package com.edunext.exam_service.Repository;

import com.edunext.exam_service.Model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Integer> {
    List<Exam> findByExamTitleContainingIgnoreCase(String examTitle);
}
