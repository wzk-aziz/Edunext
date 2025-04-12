package tn.esprit.tutoring.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.tutoring.entities.ProgressReport;

public interface ProgressReportRepository extends JpaRepository<ProgressReport, Long> {
}