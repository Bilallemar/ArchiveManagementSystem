package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;

public interface SawanihRepository extends JpaRepository<Sawanih, Integer> {
    List<Sawanih> findByManagement(Management management);

    Long countByManagement(Management management);

    @Query("""
                SELECT s FROM Sawanih s

                LEFT JOIN s.org o
                WHERE s.management.managementId = :managementId
                  AND (:isSawanih IS NULL OR s.isSawanih = :isSawanih)
                  AND (
                    :term = ''
                    OR (:field = 'name'  AND LOWER(s.name) LIKE LOWER(CONCAT('%', :term, '%')))
                    OR (:field = 'org'     AND LOWER(o.name)   LIKE LOWER(CONCAT('%', :term, '%')))
                    OR (:field = 'fatherName'    AND LOWER(s.fatherName)   LIKE LOWER(CONCAT('%', :term, '%')))
                  )
                ORDER BY s.id DESC
            """)
    Page<Sawanih> searchSawanihRepository(
            @Param("managementId") Long managementId,
            @Param("isSawanih") Boolean isSawanih,
            @Param("field") String field,
            @Param("term") String term,
            Pageable pageable);
}
