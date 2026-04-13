
package com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Nasharat;

public interface NasharatRepository extends JpaRepository<Nasharat, Integer> {

  // ── Keep your existing methods (used by Dashboard) ──────────────────────
  List<Nasharat> findByManagement(Management management);

  Long countByManagement(Management management);

  // ── New: paginated + searchable (used by ArchiveList) ───────────────────
  @Query("""
          SELECT n FROM Nasharat n
          LEFT JOIN n.senderOrg s
          LEFT JOIN n.receiverOrg r
          LEFT JOIN n.docType d
          WHERE n.management = :management
            AND (
              :term = ''
              OR (:field = 'docNo'    AND LOWER(n.docNo) LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'sender'   AND LOWER(s.name)  LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'receiver' AND LOWER(r.name)  LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'docType'  AND LOWER(d.name)  LIKE LOWER(CONCAT('%', :term, '%')))
            )
          ORDER BY n.id DESC
      """)
  Page<Nasharat> searchNasharat(
      @Param("management") Management management,
      @Param("field") String field,
      @Param("term") String term,
      Pageable pageable);
}