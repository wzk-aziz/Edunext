package com.edunext.exam_service.Repository;

import com.edunext.exam_service.Model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
   /* List<Certificate> findByExam_IdExam(int idExam);*/

}

