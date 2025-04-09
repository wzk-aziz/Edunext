package tn.esprit.merge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.merge.entities.ProgressReport;

public interface ProgressReportRepository extends JpaRepository<ProgressReport, Long> {
}