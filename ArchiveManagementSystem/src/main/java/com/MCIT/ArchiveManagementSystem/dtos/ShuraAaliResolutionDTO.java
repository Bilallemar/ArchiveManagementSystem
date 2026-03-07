package com.MCIT.ArchiveManagementSystem.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShuraAaliResolutionDTO {

  private Integer id;
  private String title;
  private String subject;
  private String letterNumber;
  private Integer approvalYear;
  private String direction;

  // NO description, NO receiveDate, NO management — list view doesn't need them
}