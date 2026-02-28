package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;

public interface MakzanSubmissionReportRepository extends JpaRepository<MakzanSubmissionReport, Integer> {
     List<MakzanSubmissionReport> findByManagement(Management management);
    Long countByManagement(Management management);



    
}
