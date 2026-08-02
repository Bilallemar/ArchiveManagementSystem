package com.MCIT.ArchiveManagementSystem.dtos.reports;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class HifziyaReportDataDTO {
    private String managementName;
    private Integer yearFrom;
    private Integer yearTo;
    private String generatedOn;

    private long totalSawanih;
    private long totalHazari;
    private long totalIndraj;
    private long totalWaradaSaderaIncoming;
    private long totalWaradaSaderaOutgoing;
    private long grandTotal;

    private Map<String, Long> sawanihByOrg;
    private Map<String, Long> hazariByOrg;
    private Map<String, Long> indrajByOrg;
    private Map<String, Long> waradaSaderaByOrg;
}