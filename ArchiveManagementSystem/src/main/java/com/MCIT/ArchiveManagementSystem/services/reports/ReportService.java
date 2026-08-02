package com.MCIT.ArchiveManagementSystem.services.reports;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.dtos.reports.ArchiveReportDataDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.ArchiveReportRowDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeReportDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.User;
import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive;
import com.MCIT.ArchiveManagementSystem.repositories.UserRepository;
import com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement.ArchiveRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ArchiveRepository archiveRepository;
    private final UserRepository userRepository;
    private final ExcelReportGenerator excelReportGenerator;
    private final NarrativeReportGenerator narrativeReportGenerator;

    public ArchiveReportDataDTO buildReportData(String username, LocalDate dateFrom, LocalDate dateTo, String direction) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Management management = user.getManagement();
        if (management == null) {
            throw new RuntimeException("No management assigned to this user");
        }

        List<Archive> docs = archiveRepository.findByManagement(management);

        List<Archive> filtered = docs.stream()
                .filter(doc -> matchesDateRange(effectiveDate(doc), dateFrom, dateTo))
                .filter(doc -> direction == null || direction.isBlank()
                        || doc.getDirection().toString().equalsIgnoreCase(direction))
                .collect(Collectors.toList());

        long totalIncoming = filtered.stream()
                .filter(d -> d.getDirection().toString().toUpperCase().contains("INCOMING"))
                .count();
        long totalOutgoing = filtered.stream()
                .filter(d -> d.getDirection().toString().toUpperCase().contains("OUTGOING"))
                .count();

        List<ArchiveReportRowDTO> rows = filtered.stream()
                .map(this::toRowDto)
                .collect(Collectors.toList());

        return ArchiveReportDataDTO.builder()
                .managementName(management.getManagementName())
                .dateFrom(dateFrom)
                .dateTo(dateTo)
                .generatedOn(LocalDate.now())
                .totalIncoming(totalIncoming)
                .totalOutgoing(totalOutgoing)
                .total(filtered.size())
                .rows(rows)
                .build();
    }

    public byte[] generateArchiveReport(String username, LocalDate dateFrom, LocalDate dateTo, String direction) {
        ArchiveReportDataDTO reportData = buildReportData(username, dateFrom, dateTo, direction);
        NarrativeReportDTO narrative = narrativeReportGenerator.build(reportData);
        return excelReportGenerator.generate(reportData, narrative);
    }

    private ArchiveReportRowDTO toRowDto(Archive doc) {
        return ArchiveReportRowDTO.builder()
                .docNo(cleanText(doc.getDocNo()))
                .senderOrgName(doc.getSenderOrg() != null ? cleanText(doc.getSenderOrg().getName()) : "")
                .receiverOrgName(doc.getReceiverOrg() != null ? cleanText(doc.getReceiverOrg().getName()) : "")
                .docTypeName(doc.getDocType() != null ? cleanText(doc.getDocType().getName()) : "")
                .direction(doc.getDirection().toString())
                .sendDate(doc.getSendDate())
                .receiveDate(doc.getReceiveDate())
                .departmentDate(doc.getDepartmentDate())
                .description(cleanText(doc.getDescription()))
                .build();
    }

    private LocalDate effectiveDate(Archive doc) {
        if (doc.getSendDate() != null) return doc.getSendDate();
        if (doc.getDepartmentDate() != null) return doc.getDepartmentDate();
        return doc.getReceiveDate();
    }

    private boolean matchesDateRange(LocalDate date, LocalDate from, LocalDate to) {
        if (date == null) return from == null && to == null;
        if (from != null && date.isBefore(from)) return false;
        if (to != null && date.isAfter(to)) return false;
        return true;
    }

    private String cleanText(String text) {
        if (text == null) return "";
        return text
                .replace("\u200C", "")
                .replace("\u064A", "\u06CC");
    }
}