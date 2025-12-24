package com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive;

public interface ArchiveRepository extends JpaRepository<Archive, Integer> {
 List<Archive> findByManagement(Management management);
    Long countByManagement(Management management);
    
}
