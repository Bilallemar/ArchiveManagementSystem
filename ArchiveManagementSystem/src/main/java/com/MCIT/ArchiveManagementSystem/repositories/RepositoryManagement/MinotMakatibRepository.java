package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.MinotMakatib;

public interface MinotMakatibRepository extends JpaRepository<MinotMakatib, Integer> {

  List<MinotMakatib> findByManagement(Management management);

  Long countByManagement(Management management);

  @Query("""
          SELECT m FROM MinotMakatib m

          LEFT JOIN m.org o
          WHERE m.management.managementId = :managementId
            AND (
              :term = ''
              OR (:field = 'cartonNumber'  AND LOWER(m.cartonNumber) LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'org'     AND LOWER(o.name)   LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'subject'    AND LOWER(m.subject)   LIKE LOWER(CONCAT('%', :term, '%')))
               OR (:field = 'letterNumber'    AND LOWER(m.letterNumber)   LIKE LOWER(CONCAT('%', :term, '%')))
            )
          ORDER BY m.id DESC
      """)
  Page<MinotMakatib> searchMinotMakatibRepository(
      @Param("managementId") Long managementId,
      @Param("field") String field,
      @Param("term") String term,
      Pageable pageable);
}
