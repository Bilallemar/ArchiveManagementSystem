package com.MCIT.ArchiveManagementSystem.dtos.reports;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

/**
 * Lightweight counts-only view of the Hifziya report, used to populate the
 * frontend summary chips before the user downloads the full narrative Excel.
 */
@Data
@Builder
public class HifziyaReportSummaryDTO {

  private String managementName;
  private LocalDate dateFrom;
  private LocalDate dateTo;

  private long totalAll;
  private long totalSawanih;
  private long totalHazari;
  private long totalWaradaSadera;
  private long totalMinotMakatib;
  private long totalShura;

  private long totalIncoming;
  private long totalOutgoing;
}