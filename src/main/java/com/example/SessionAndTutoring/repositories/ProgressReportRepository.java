package com.example.SessionAndTutoring.repositories;

import com.example.SessionAndTutoring.entities.ProgressReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgressReportRepository extends JpaRepository<ProgressReport, Long> {
}