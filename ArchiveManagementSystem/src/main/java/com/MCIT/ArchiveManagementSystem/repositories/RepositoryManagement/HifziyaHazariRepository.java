package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;

public interface HifziyaHazariRepository extends JpaRepository<HifziyaHazari, Integer> {

  List<HifziyaHazari> findByManagement(Management management);

  Long countByManagement(Management management);

  @Query("""
          SELECT h FROM HifziyaHazari h
          LEFT JOIN h.type t
          LEFT JOIN h.subType st
          LEFT JOIN h.org o
          WHERE h.management.managementId = :managementId
            AND (:isIndraj IS NULL OR h.isIndraj = :isIndraj)
            AND (
              :term = ''
              OR (:field = 'volume'  AND LOWER(h.volume) LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'org'     AND LOWER(o.name)   LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'type'    AND LOWER(t.name)   LIKE LOWER(CONCAT('%', :term, '%')))
              OR (:field = 'subType' AND LOWER(st.name)  LIKE LOWER(CONCAT('%', :term, '%')))
            )
          ORDER BY h.id DESC
      """)
  Page<HifziyaHazari> searchHifziyaHazari(
      @Param("managementId") Long managementId,
      @Param("isIndraj") Boolean isIndraj,
      @Param("field") String field,
      @Param("term") String term,
      Pageable pageable);
}
