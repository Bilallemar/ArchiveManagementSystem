package com.MCIT.ArchiveManagementSystem.dtos.reports;


import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArchiveReportRowDTO {
    private String docNo;
    private String senderOrgName;
    private String receiverOrgName;
    private String docTypeName;
    private String direction;
    private LocalDate sendDate;
    private LocalDate receiveDate;
    private LocalDate departmentDate;
    private String description;
}