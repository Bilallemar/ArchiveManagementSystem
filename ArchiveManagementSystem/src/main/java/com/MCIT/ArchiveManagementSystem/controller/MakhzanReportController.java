package com.MCIT.ArchiveManagementSystem.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.MCIT.ArchiveManagementSystem.dtos.reports.MakhzanReportDataDTO;
import com.MCIT.ArchiveManagementSystem.services.reports.MakhzanReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports/makhzan")
@RequiredArgsConstructor
public class MakhzanReportController {

    private final MakhzanReportService reportService;

    @GetMapping("/preview")
    public ResponseEntity<MakhzanReportDataDTO> preview(
            @RequestParam(required = false) Integer yearFrom,
            @RequestParam(required = false) Integer yearTo,
            Authentication authentication) {

        return ResponseEntity.ok(reportService.buildReportData(authentication.getName(), yearFrom, yearTo));
    }

    @GetMapping
    public ResponseEntity<byte[]> download(
            @RequestParam(required = false) Integer yearFrom,
            @RequestParam(required = false) Integer yearTo,
            Authentication authentication) {

        byte[] excel = reportService.generateExcel(authentication.getName(), yearFrom, yearTo);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=makhzan-report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}