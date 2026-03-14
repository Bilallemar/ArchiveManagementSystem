package com.MCIT.ArchiveManagementSystem.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MakzanSubmissionReportSummaryDTO {
  private Integer id;
  private Integer year; // ← Integer, matches entity
  private String provinceName;
  private String districtName;
}
