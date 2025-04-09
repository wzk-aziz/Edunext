package com.example.SessionAndTutoring.services;

import com.example.SessionAndTutoring.entities.ProgressReport;
import com.example.SessionAndTutoring.repositories.ProgressReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgressReportServiceImpl implements IProgressReportService {

    @Autowired
    private ProgressReportRepository progressReportRepository;

    @Override
    public List<ProgressReport> getAllProgressReports() {
        return progressReportRepository.findAll();
    }

    @Override
    public ProgressReport getProgressReportById(Long id) {
        return progressReportRepository.findById(id).orElse(null);
    }

    @Override
    public ProgressReport createProgressReport(ProgressReport progressReport) {
        return progressReportRepository.save(progressReport);
    }

    @Override
    public ProgressReport updateProgressReport(Long id, ProgressReport progressReport) {
        if (progressReportRepository.existsById(id)) {
            progressReport.setIdReport(id);
            return progressReportRepository.save(progressReport);
        }
        return null;
    }

    @Override
    public void deleteProgressReport(Long id) {
        progressReportRepository.deleteById(id);
    }
}