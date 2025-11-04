package com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement;
import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.ExportDoc;

public interface ExportDocRepository extends JpaRepository<ExportDoc, Long> {

    
}
