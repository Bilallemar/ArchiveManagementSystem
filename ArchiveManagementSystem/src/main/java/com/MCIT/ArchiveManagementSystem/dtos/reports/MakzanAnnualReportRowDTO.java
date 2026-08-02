package com.MCIT.ArchiveManagementSystem.dtos.reports;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MakzanAnnualReportRowDTO {
    private String provinceName;
    private String districtName;
    private Integer year;
    private String docTypeName;
    private String summaryWaseqa;
    private String description;
}