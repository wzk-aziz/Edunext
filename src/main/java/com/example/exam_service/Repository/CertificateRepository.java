package com.example.exam_service.Repository;

import com.example.exam_service.Model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
   /* List<Certificate> findByExam_IdExam(int idExam);*/

}

