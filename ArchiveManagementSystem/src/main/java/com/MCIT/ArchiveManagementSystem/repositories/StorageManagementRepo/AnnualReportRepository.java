package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.AnnualReport;

public interface AnnualReportRepository extends JpaRepository<AnnualReport, Long> {

    List<AnnualReport> findByBookNumberContainingIgnoreCaseOrProvinceContainingIgnoreCaseOrDistrictContainingIgnoreCase(
        String bookNumber, String province, String district
    );

    // 🔹 د هر فیلډ لپاره جلا methods (د فلټر لپاره)
    List<AnnualReport> findByBookNumberContainingIgnoreCase(String keyword);
    List<AnnualReport> findByProvinceContainingIgnoreCase(String keyword);
    List<AnnualReport> findByDistrictContainingIgnoreCase(String keyword);
}