package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;

public interface MakzanSubmissionReportRepository extends JpaRepository<MakzanSubmissionReport, Integer> {
     List<MakzanSubmissionReport> findByManagement(Management management);
    Long countByManagement(Management management);

    //  List<MakzanSubmissionReport> findByBookNumberContainingIgnoreCaseOrProvinceContainingIgnoreCaseOrDistrictContainingIgnoreCase(
    //     String bookNumber, String province, String district
    // );

    // // 🔹 د هر فیلډ لپاره جلا methods (د فلټر لپاره)
    // List<MakzanSubmissionReport> findByBookNumberContainingIgnoreCase(String keyword);
    // List<MakzanSubmissionReport> findByProvinceContainingIgnoreCase(String keyword);
    // List<MakzanSubmissionReport> findByDistrictContainingIgnoreCase(String keyword);

    
}
