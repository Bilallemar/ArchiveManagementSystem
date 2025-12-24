package com.MCIT.ArchiveManagementSystem.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ManagementStatsDTO {
    // Archive Management
    private Long archives;
        private String managementName; // اضافه شو

    // Repository Management
    private Long sawanih;
    private Long hifziyaHazari;
    private Long hifziyaWaradaSadera;
    
    // Storage Management
    private Long makzanReceipts;
    private Long makzanAnnualReports;
    private Long makzanSubmissionReports;
    
    // Summary
    private Long totalDocuments;
}