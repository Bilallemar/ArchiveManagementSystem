package com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.Org;
import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive;

public interface ArchiveRepository extends JpaRepository<Archive, Integer> {
  List<Archive> findByOrg(Org org);
    Long countByOrg(Org org);
    
}
