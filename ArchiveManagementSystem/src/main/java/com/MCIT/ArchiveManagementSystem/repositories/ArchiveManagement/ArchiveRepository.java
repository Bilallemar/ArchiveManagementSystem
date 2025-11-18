package com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement;
import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive;

public interface ArchiveRepository extends JpaRepository<Archive, Integer> {

    
}
