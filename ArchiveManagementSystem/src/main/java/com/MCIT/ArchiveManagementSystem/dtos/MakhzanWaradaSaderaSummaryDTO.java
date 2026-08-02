package com.MCIT.ArchiveManagementSystem.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MakhzanWaradaSaderaSummaryDTO {

  private Integer id;
  private String letterNumber;
  private LocalDate incommingDate;
  private String subjectType;
  private String senderOrgName;
  private String receiverOrgName; // ← renamed from senderOrgName
  private String direction;
  // NO description, NO receiveDate, NO management — list view doesn't need them
}