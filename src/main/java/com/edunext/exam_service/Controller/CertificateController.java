package com.edunext.exam_service.Controller;

import com.edunext.exam_service.Model.Certificate;
import com.edunext.exam_service.Service.CertificateService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.ByteArrayResource;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "http://localhost:4200")
public class CertificateController {

   @Autowired
    private CertificateService certificateService;

   /* @PostMapping("/{idExam}")
    public Certificate createCertificate(
            @PathVariable int idExam,
            @RequestBody Certificate certificate
    ) {
        return certificateService.createCertificate(idExam, certificate);
    }*/
   @GetMapping("/download/{id}")
   public ResponseEntity<ByteArrayResource> downloadCertificate(@PathVariable int id) {
       return certificateService.generateCertificate(id);
   }
    @GetMapping
    public List<Certificate> getAllCertificates() {
        return certificateService.getAllCertificates();
    }
    @PutMapping("/{id}")
    public ResponseEntity<Certificate> updateCertificate(@PathVariable Long id, @RequestBody Certificate certificateDetails) {
        Certificate updatedCertificate = certificateService.updateCertificate(id, certificateDetails);
        return ResponseEntity.ok(updatedCertificate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificateService.deleteCertificate(id);
        return ResponseEntity.noContent().build();
    }
   /* @GetMapping("/exam/{idExam}")
    public List<Certificate> getCertificates(@PathVariable int idExam) {
        return certificateService.getCertificatesByExam(idExam);
    }*/



}


