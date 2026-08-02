package com.MCIT.ArchiveManagementSystem.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.dtos.reports.HifziyaReportDataDTO;
import com.MCIT.ArchiveManagementSystem.services.reports.HifziyaReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports/hifziya")
@RequiredArgsConstructor
public class HifziyaReportController {

  private final HifziyaReportService reportService;

  @GetMapping("/preview")
  public ResponseEntity<HifziyaReportDataDTO> preview(
      @RequestParam(required = false) Integer yearFrom,
      @RequestParam(required = false) Integer yearTo) {

    return ResponseEntity.ok(reportService.buildReportData(yearFrom, yearTo));
  }

  @GetMapping
  public ResponseEntity<byte[]> download(
      @RequestParam(required = false) Integer yearFrom,
      @RequestParam(required = false) Integer yearTo) {

    byte[] excel = reportService.generateExcel(yearFrom, yearTo);

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=hifziya-report.xlsx")
        .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
        .body(excel);
  }
}