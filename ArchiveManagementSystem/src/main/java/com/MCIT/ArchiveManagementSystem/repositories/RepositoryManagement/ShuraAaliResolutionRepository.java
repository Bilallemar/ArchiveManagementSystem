package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ShuraAaliResolution;
import com.MCIT.ArchiveManagementSystem.models.enums.ShuraAliDirection;

public interface ShuraAaliResolutionRepository
    extends JpaRepository<ShuraAaliResolution, Integer> {

  List<ShuraAaliResolution> findByManagement(Management management);

  Long countByManagement(Management management);

  @Query("""
              SELECT s FROM ShuraAaliResolution s
              WHERE s.management = :management
                AND (:direction IS NULL OR s.direction = :direction)
                AND (
                  :term = ''
                  OR (:field = 'title'    AND LOWER(s.title) LIKE LOWER(CONCAT('%', :term, '%')))
      OR (:field = 'letterNumber' AND LOWER(s.letterNumber)  LIKE LOWER(CONCAT('%', :term, '%')))
      OR (:field = 'subject'           AND LOWER(s.subject)            LIKE LOWER(CONCAT('%', :term, '%')))
                )
              ORDER BY s.id DESC
          """)
  Page<ShuraAaliResolution> searchShuraAaliResolution(
      @Param("management") Management management,
      @Param("direction") ShuraAliDirection direction,
      @Param("field") String field,
      @Param("term") String term,
      Pageable pageable);

}
