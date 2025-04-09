package com.example.SessionAndTutoring.services;

import com.example.SessionAndTutoring.entities.ProgressReport;

import java.util.List;

public interface IProgressReportService {
    List<ProgressReport> getAllProgressReports();
    ProgressReport getProgressReportById(Long id);
    ProgressReport createProgressReport(ProgressReport progressReport);
    ProgressReport updateProgressReport(Long id, ProgressReport progressReport);
    void deleteProgressReport(Long id);
}