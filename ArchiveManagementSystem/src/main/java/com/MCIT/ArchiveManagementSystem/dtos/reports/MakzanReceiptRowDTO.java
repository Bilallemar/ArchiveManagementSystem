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
public class MakzanReceiptRowDTO {
    private String docNo;
    private String department;
    private String orgName;
    private String letterNo;
    private LocalDate letterDate;
    private String subjectType;
    private String description;
}