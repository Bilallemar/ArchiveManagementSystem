package com.MCIT.ArchiveManagementSystem.dtos.reports;

import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArchiveReportDataDTO {
    private String managementName;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private LocalDate generatedOn;
    private long totalIncoming;
    private long totalOutgoing;
    private long total;
    private List<ArchiveReportRowDTO> rows;
}