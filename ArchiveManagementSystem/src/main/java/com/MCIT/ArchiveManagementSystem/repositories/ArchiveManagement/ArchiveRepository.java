
package com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive;
import com.MCIT.ArchiveManagementSystem.models.enums.ArchiveDirection;

public interface ArchiveRepository extends JpaRepository<Archive, Integer> {

  // ── Keep your existing methods (used by Dashboard) ──────────────────────
  List<Archive> findByManagement(Management management);

  Long countByManagement(Management management);

  // ── New: paginated + searchable (used by ArchiveList) ───────────────────
  @Query("""
          SELECT a FROM Archive a
          LEFT JOIN a.senderOrg s
          LEFT JOIN a.receiverOrg r
          LEFT JOIN a.docType d
          WHERE a.management = :management
            AND (:direction IS NULL OR a.direction = :direction)
            AND (
              :term = ''
              OR (:field = 'docNo'    AND LOWER(a.docNo) LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'sender'   AND LOWER(s.name)  LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'receiver' AND LOWER(r.name)  LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'docType'  AND LOWER(d.name)  LIKE LOWER(CONCAT('%', :term, '%')))
            )
          ORDER BY a.id DESC
      """)
  Page<Archive> searchArchives(
      @Param("management") Management management,
      @Param("direction") ArchiveDirection direction,
      @Param("field") String field,
      @Param("term") String term,
      Pageable pageable);
}