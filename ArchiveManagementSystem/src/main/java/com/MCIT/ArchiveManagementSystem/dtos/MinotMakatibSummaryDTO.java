package com.MCIT.ArchiveManagementSystem.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MinotMakatibSummaryDTO {
  private Integer id;
  private String cartonNumber;
  private String letterNumber;
  private Integer year;
  private String subject;
  private String orgName;

}
