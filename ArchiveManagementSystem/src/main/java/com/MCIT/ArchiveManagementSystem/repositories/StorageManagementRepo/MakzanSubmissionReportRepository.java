package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;

public interface MakzanSubmissionReportRepository extends JpaRepository<MakzanSubmissionReport, Integer> {
     List<MakzanSubmissionReport> findByManagement(Management management);
    Long countByManagement(Management management);


 @Query("""
                SELECT m FROM MakzanSubmissionReport m
                LEFT JOIN m.province p
                LEFT JOIN m.district d
                WHERE m.management = :management
                  AND (
                    :term = ''
                    OR (:field = 'province' AND LOWER(p.name) LIKE LOWER(CONCAT('%', :term, '%')))
                    OR (:field = 'district' AND LOWER(d.name) LIKE LOWER(CONCAT('%', :term, '%')))
                    OR (:field = 'year'     AND CAST(m.year AS string) LIKE CONCAT('%', :term, '%'))
                  )
                ORDER BY m.id DESC
            """)
    Page<MakzanSubmissionReport> searchMakzanSubmissionReport(
            @Param("management") Management management,
            @Param("field") String field,
            @Param("term") String term,
            Pageable pageable);
    
}
