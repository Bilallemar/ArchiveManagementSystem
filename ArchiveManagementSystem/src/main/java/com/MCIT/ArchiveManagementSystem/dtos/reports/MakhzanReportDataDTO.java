package com.MCIT.ArchiveManagementSystem.dtos.reports;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MakhzanReportDataDTO {
    private String managementName;
    private Integer yearFrom;
    private Integer yearTo;
    private String generatedOn;

    private long totalReceipts;
    private long totalAnnualReports;
    private long totalSubmissionReports;
    private long totalWarada;
    private long totalSadera;
    private long grandTotal;

    private List<MakzanReceiptRowDTO> receiptRows;
    private List<MakzanAnnualReportRowDTO> annualReportRows;
    private List<MakzanSubmissionReportRowDTO> submissionReportRows;
    private List<MakhzanWaradaSaderaRowDTO> waradaSaderaRows;
}