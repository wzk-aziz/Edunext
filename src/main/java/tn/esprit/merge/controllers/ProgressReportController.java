package tn.esprit.merge.controllers;

import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import tn.esprit.merge.entities.Learner;
    import tn.esprit.merge.entities.MentorshipProgram;
    import tn.esprit.merge.entities.ProgressReport;
    import tn.esprit.merge.repositories.LearnerRepository;
    import tn.esprit.merge.services.IMentorshipProgramService;
    import tn.esprit.merge.services.IProgressReportService;

    import java.util.Date;
    import java.util.List;

    @RestController
    @RequestMapping("/progress-reports")
    @CrossOrigin(origins = "http://localhost:4200")
    public class ProgressReportController {

        @Autowired
        private IProgressReportService progressReportService;

        @Autowired
        private IMentorshipProgramService mentorshipProgramService;

        @Autowired
        private LearnerRepository learnerRepository;

        @GetMapping("/all")
        public ResponseEntity<List<ProgressReport>> getAllProgressReports() {
            List<ProgressReport> reports = progressReportService.getAllProgressReports();
            return new ResponseEntity<>(reports, HttpStatus.OK);
        }

        @GetMapping("/{id}")
        public ResponseEntity<ProgressReport> getProgressReportById(@PathVariable Long id) {
            ProgressReport report = progressReportService.getProgressReportById(id);
            return report != null ?
                new ResponseEntity<>(report, HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        @PostMapping
        public ResponseEntity<ProgressReport> createProgressReport(@RequestBody ProgressReport progressReport) {
            try {
                MentorshipProgram program = mentorshipProgramService
                    .getMentorshipProgramById(progressReport.getMentorshipProgramId());
                Learner learner = learnerRepository.findById(progressReport.getLearnerId())
                    .orElse(null);

                if (program == null || learner == null) {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }

                progressReport.setMentorshipProgram(program);
                progressReport.setLearner(learner);

                if (progressReport.getReportDate() == null) {
                    progressReport.setReportDate(new Date());
                }

                ProgressReport savedReport = progressReportService.createProgressReport(progressReport);
                return new ResponseEntity<>(savedReport, HttpStatus.CREATED);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        @PutMapping("/{id}")
        public ResponseEntity<ProgressReport> updateProgressReport(
                @PathVariable Long id,
                @RequestBody ProgressReport progressReport) {
            try {
                ProgressReport existingReport = progressReportService.getProgressReportById(id);
                if (existingReport == null) {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }

                if (progressReport.getMentorshipProgramId() != null) {
                    MentorshipProgram program = mentorshipProgramService
                        .getMentorshipProgramById(progressReport.getMentorshipProgramId());
                    if (program != null) {
                        progressReport.setMentorshipProgram(program);
                    }
                }

                if (progressReport.getLearnerId() != null) {
                    Learner learner = learnerRepository.findById(progressReport.getLearnerId())
                        .orElse(null);
                    if (learner != null) {
                        progressReport.setLearner(learner);
                    }
                }

                progressReport.setIdReport(id);
                ProgressReport updatedReport = progressReportService.updateProgressReport(id, progressReport);
                return new ResponseEntity<>(updatedReport, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteProgressReport(@PathVariable Long id) {
            try {
                ProgressReport report = progressReportService.getProgressReportById(id);
                if (report == null) {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
                progressReportService.deleteProgressReport(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }