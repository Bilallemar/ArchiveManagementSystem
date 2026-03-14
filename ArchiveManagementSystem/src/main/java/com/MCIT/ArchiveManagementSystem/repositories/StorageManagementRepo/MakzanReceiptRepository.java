package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;

public interface MakzanReceiptRepository extends JpaRepository<MakzanReceipt, Integer> {

    List<MakzanReceipt> findByManagement(Management management);

    Long countByManagement(Management management);

    // Search across relevant fields
    @Query("""
                SELECT m FROM MakzanReceipt m
                LEFT JOIN m.org o
                WHERE m.management = :management
                  AND (
                    :term = ''
                    OR (:field = 'docNo'       AND LOWER(m.docNo)       LIKE LOWER(CONCAT('%', :term, '%')))
                    OR (:field = 'department'  AND LOWER(m.department)  LIKE LOWER(CONCAT('%', :term, '%')))
                    OR (:field = 'org'         AND LOWER(o.name)        LIKE LOWER(CONCAT('%', :term, '%')))
                    OR (:field = 'letterNo'    AND LOWER(m.letterNo)    LIKE LOWER(CONCAT('%', :term, '%')))
                    OR (:field = 'subjectType' AND LOWER(m.subjectType) LIKE LOWER(CONCAT('%', :term, '%')))
                  )
                ORDER BY m.id DESC
            """)
    Page<MakzanReceipt> searchMakzanReceipt(
            @Param("management") Management management,
            @Param("field") String field,
            @Param("term") String term,
            Pageable pageable);
}