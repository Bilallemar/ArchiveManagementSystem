package com.MCIT.ArchiveManagementSystem.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArchiveSummaryDTO {

    private Integer id;
    private String docNo;
    private String sendDate;
    private String departmentDate;
    private String receiveDate; 
    private String senderOrgName; // just the name, not the whole Org object
    private String receiverOrgName; // just the name, not the whole Org object
    private String docTypeName; // just the name, not the whole DocType object
    private String direction;
    private String description;
    // NO description, NO receiveDate, NO management — list view doesn't need them
}