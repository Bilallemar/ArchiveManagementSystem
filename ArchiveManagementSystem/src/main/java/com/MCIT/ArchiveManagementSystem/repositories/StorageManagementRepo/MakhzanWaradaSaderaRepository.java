package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakhzanWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.enums.MakhzanWaradaSaderaDirection;

public interface MakhzanWaradaSaderaRepository extends JpaRepository<MakhzanWaradaSadera, Integer> {
    List<MakhzanWaradaSadera> findByManagement(Management management);

    Long countByManagement(Management management);
    @Query("""
                    SELECT h FROM MakhzanWaradaSadera h
                    LEFT JOIN h.org o
                    WHERE h.management = :management
                      AND (:direction IS NULL OR h.direction = :direction)
                      AND (
                        :term = ''
                        OR (:field = 'org'    AND LOWER(o.name) LIKE LOWER(CONCAT('%', :term, '%')))
            OR (:field = 'letterNumber' AND LOWER(h.letterNumber)  LIKE LOWER(CONCAT('%', :term, '%')))
            OR (:field = 'no'           AND LOWER(h.no)            LIKE LOWER(CONCAT('%', :term, '%')))
            OR (:field = 'subjectType'  AND LOWER(h.subjectType)   LIKE LOWER(CONCAT('%', :term, '%')))
                      )
                    ORDER BY h.id DESC
                """)
    Page<MakhzanWaradaSadera> searchMakhzanWaradaSadera(
            @Param("management") Management management,
            @Param("direction") MakhzanWaradaSaderaDirection direction,
            @Param("field") String field,
            @Param("term") String term,
            Pageable pageable);
}
