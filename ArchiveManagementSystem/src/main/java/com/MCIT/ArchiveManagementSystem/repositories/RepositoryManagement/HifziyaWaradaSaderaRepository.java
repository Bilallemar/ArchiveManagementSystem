package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.enums.HifziyaWaradaSaderaDirection;

public interface HifziyaWaradaSaderaRepository extends JpaRepository<HifziyaWaradaSadera, Integer> {

  List<HifziyaWaradaSadera> findByManagement(Management management);

  Long countByManagement(Management management);

  @Query("""
          SELECT h FROM HifziyaWaradaSadera h
          LEFT JOIN h.receiverOrg ro
          LEFT JOIN h.senderOrg so
          WHERE h.management = :management
            AND (:direction IS NULL OR h.direction = :direction)
            AND (
              :term = ''
              OR (:field = 'receiverOrg' AND LOWER(ro.name) LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'senderOrg' AND LOWER(so.name) LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'letterNumber' AND LOWER(h.letterNumber) LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'no' AND LOWER(h.no) LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'subjectType' AND LOWER(h.subjectType) LIKE LOWER(CONCAT('%', :term, '%')))
            )
          ORDER BY h.id DESC
      """)
  Page<HifziyaWaradaSadera> searchHifziyaWaradaSadera(
      @Param("management") Management management,
      @Param("direction") HifziyaWaradaSaderaDirection direction,
      @Param("field") String field,
      @Param("term") String term,
      Pageable pageable);
}
