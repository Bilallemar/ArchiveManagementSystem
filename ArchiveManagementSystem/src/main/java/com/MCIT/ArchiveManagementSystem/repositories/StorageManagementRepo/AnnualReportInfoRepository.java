package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.AnnualReportInfo;

public interface AnnualReportInfoRepository extends JpaRepository<AnnualReportInfo, Long> {

    //  List<AnnualReportInfo> findByBookNumberContainingIgnoreCaseOrPravinceContainingIgnoreCaseOrDistrictContainingIgnoreCase(
    //     String bookNumber, String pravince, String district
    // );

    // // 🔹 د هر فیلډ لپاره جلا methods (د فلټر لپاره)
    // List<AnnualReportInfo> findByBookNumberContainingIgnoreCase(String keyword);
    // List<AnnualReportInfo> findByPravinceContainingIgnoreCase(String keyword);
    // List<AnnualReportInfo> findByDistrictContainingIgnoreCase(String keyword);

    
}
