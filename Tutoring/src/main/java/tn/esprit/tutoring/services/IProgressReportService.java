package tn.esprit.tutoring.services;

import tn.esprit.tutoring.entities.ProgressReport;

import java.util.List;

public interface IProgressReportService {
    List<ProgressReport> getAllProgressReports();
    ProgressReport getProgressReportById(Long id);
    ProgressReport createProgressReport(ProgressReport progressReport);
    ProgressReport updateProgressReport(Long id, ProgressReport progressReport);
    void deleteProgressReport(Long id);
}