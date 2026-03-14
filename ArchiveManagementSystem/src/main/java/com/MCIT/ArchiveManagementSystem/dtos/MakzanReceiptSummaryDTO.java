package com.MCIT.ArchiveManagementSystem.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MakzanReceiptSummaryDTO {
    private Integer id;
    private String  docNo;
    private String  department;
    private String  orgName;       // flat — org.name
    private String  letterNo;
    private String  subjectType;
    // NO letterDate, NO description, NO files — show in View dialog
}