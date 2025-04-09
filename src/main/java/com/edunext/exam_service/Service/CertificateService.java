package com.edunext.exam_service.Service;

import com.edunext.exam_service.Model.Certificate;
import com.edunext.exam_service.Repository.CertificateRepository;
import com.edunext.exam_service.Repository.ExamRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;

import org.springframework.http.*;
import com.itextpdf.layout.Document;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Paragraph;

import java.io.ByteArrayOutputStream;

import java.util.List;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private ExamRepository examRepository;

    public ResponseEntity<ByteArrayResource> generateCertificate(int id) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.close();

            ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
   /* public Certificate createCertificate(int idExam, Certificate certificate) {
        Exam exam = examRepository.findById(idExam)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        certificate.setExam(exam);
        return certificateRepository.save(certificate);
    }*/
    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAll();
    }

    public Certificate updateCertificate(Long id, Certificate newDetails) {
        return certificateRepository.findById(id)
                .map(cert -> {
                    cert.setIssueDate(newDetails.getIssueDate());
                    cert.setRecipientName(newDetails.getRecipientName());
                    cert.setTitle(newDetails.getTitle());
                    return certificateRepository.save(cert);
                })
                .orElseThrow(() -> new RuntimeException("Certificat non trouvé"));
    }

    // ❌ Supprimer un certificat
    public void deleteCertificate(Long id) {
        if (!certificateRepository.existsById(id)) {
            throw new RuntimeException("Certificat non trouvé");
        }
        certificateRepository.deleteById(id);
    }
    /*
    public List<Certificate> getCertificatesByExam(int idExam) {
        return certificateRepository.findByExam_IdExam(idExam);
    }*/
}



