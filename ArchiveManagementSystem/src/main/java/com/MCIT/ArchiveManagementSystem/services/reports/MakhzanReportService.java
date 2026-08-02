package com.MCIT.ArchiveManagementSystem.services.reports;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.dtos.reports.MakhzanReportDataDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.MakhzanWaradaSaderaRowDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.MakzanAnnualReportRowDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.MakzanReceiptRowDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.MakzanSubmissionReportRowDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeReportDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakhzanWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanAnnualReport;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;
import com.MCIT.ArchiveManagementSystem.repositories.ManagementRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakhzanWaradaSaderaRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanAnnualReportRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanSubmissionReportRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MakhzanReportService {

  private static final String MAKHZAN_MANAGEMENT_NAME = "Makhzan";

  private final MakzanReceiptRepository makzanReceiptRepository;
  private final MakzanAnnualReportRepository makzanAnnualReportRepository;
  private final MakzanSubmissionReportRepository makzanSubmissionReportRepository;
  private final MakhzanWaradaSaderaRepository makhzanWaradaSaderaRepository;
  private final ManagementRepository managementRepository;
  private final MakhzanExcelReportGenerator excelReportGenerator;
  private final MakhzanNarrativeReportGenerator narrativeReportGenerator;

  private static final DateTimeFormatter[] DATE_FORMATS = {
      DateTimeFormatter.ofPattern("yyyy-MM-dd"),
      DateTimeFormatter.ofPattern("yyyy/MM/dd"),
      DateTimeFormatter.ofPattern("dd-MM-yyyy"),
      DateTimeFormatter.ofPattern("dd/MM/yyyy"),
  };

  public MakhzanReportDataDTO buildReportData(String username, Integer yearFrom, Integer yearTo) {
    // This endpoint is specifically for the Makhzan report, regardless of
    // which management the requesting user happens to be assigned to.
    Management management = managementRepository.findByManagementName(MAKHZAN_MANAGEMENT_NAME)
        .orElseThrow(() -> new RuntimeException("Makhzan management not found"));

List<MakzanReceipt> receipts = makzanReceiptRepository.findByManagement(management).stream()
    .filter(r -> matchesYear(
        r.getLetterDate() != null ? r.getLetterDate().getYear() : null,
        yearFrom, yearTo))
    .collect(Collectors.toList());

    List<MakzanAnnualReport> annualReports = makzanAnnualReportRepository.findByManagement(management).stream()
        .filter(r -> matchesYear(r.getYear(), yearFrom, yearTo))
        .collect(Collectors.toList());

    List<MakzanSubmissionReport> submissionReports = makzanSubmissionReportRepository.findByManagement(management)
        .stream()
        .filter(r -> matchesYear(r.getYear(), yearFrom, yearTo))
        .collect(Collectors.toList());

    List<MakhzanWaradaSadera> waradaSadera = makhzanWaradaSaderaRepository.findByManagement(management).stream()
        .filter(r -> matchesYear(effectiveYear(r), yearFrom, yearTo))
        .collect(Collectors.toList());

    long totalWarada = waradaSadera.stream()
        .filter(r -> r.getDirection() != null && r.getDirection().toString().toUpperCase().contains("INCOMING"))
        .count();
    long totalSadera = waradaSadera.stream()
        .filter(r -> r.getDirection() != null && r.getDirection().toString().toUpperCase().contains("OUTGOING"))
        .count();

    long grandTotal = receipts.size() + annualReports.size() + submissionReports.size() + waradaSadera.size();

    return MakhzanReportDataDTO.builder()
        .managementName(management.getManagementName())
        .yearFrom(yearFrom)
        .yearTo(yearTo)
        .generatedOn(LocalDate.now().toString())
        .totalReceipts(receipts.size())
        .totalAnnualReports(annualReports.size())
        .totalSubmissionReports(submissionReports.size())
        .totalWarada(totalWarada)
        .totalSadera(totalSadera)
        .grandTotal(grandTotal)
        .receiptRows(receipts.stream().map(this::toReceiptRow).collect(Collectors.toList()))
        .annualReportRows(annualReports.stream().map(this::toAnnualRow).collect(Collectors.toList()))
        .submissionReportRows(submissionReports.stream().map(this::toSubmissionRow).collect(Collectors.toList()))
        .waradaSaderaRows(waradaSadera.stream().map(this::toWaradaSaderaRow).collect(Collectors.toList()))
        .build();
  }

  public byte[] generateExcel(String username, Integer yearFrom, Integer yearTo) {
    MakhzanReportDataDTO data = buildReportData(username, yearFrom, yearTo);
    NarrativeReportDTO narrative = narrativeReportGenerator.build(data);
    return excelReportGenerator.generate(data, narrative);
  }

  // ---------- Row mapping ----------

  private MakzanReceiptRowDTO toReceiptRow(MakzanReceipt r) {
    return MakzanReceiptRowDTO.builder()
        .docNo(cleanText(r.getDocNo()))
        .department(cleanText(r.getDepartment()))
        .orgName(r.getOrg() != null ? cleanText(r.getOrg().getName()) : "")
        .letterNo(cleanText(r.getLetterNo()))
        .letterDate(r.getLetterDate())
        .subjectType(cleanText(r.getSubjectType()))
        .description(cleanText(r.getDescription()))
        .build();
  }

  private MakzanAnnualReportRowDTO toAnnualRow(MakzanAnnualReport r) {
    return MakzanAnnualReportRowDTO.builder()
        .provinceName(r.getProvince() != null ? cleanText(r.getProvince().getName()) : "")
        .districtName(r.getDistrict() != null ? cleanText(r.getDistrict().getName()) : "")
        .year(r.getYear())
        .docTypeName(r.getDocType() != null ? cleanText(r.getDocType().getName()) : "")
        .summaryWaseqa(cleanText(r.getSummaryWaseqa()))
        .description(cleanText(r.getDescription()))
        .build();
  }

  private MakzanSubmissionReportRowDTO toSubmissionRow(MakzanSubmissionReport r) {
    return MakzanSubmissionReportRowDTO.builder()
        .provinceName(r.getProvince() != null ? cleanText(r.getProvince().getName()) : "")
        .districtName(r.getDistrict() != null ? cleanText(r.getDistrict().getName()) : "")
        .year(r.getYear())
        .docTypeName(r.getDocType() != null ? cleanText(r.getDocType().getName()) : "")
        .summaryWaseqa(cleanText(r.getSummaryWaseqa()))
        .description(cleanText(r.getDescription()))
        .build();
  }

  private MakhzanWaradaSaderaRowDTO toWaradaSaderaRow(MakhzanWaradaSadera r) {
    return MakhzanWaradaSaderaRowDTO.builder()
        .no(cleanText(r.getNo()))
        .orgName(r.getSenderOrg() != null
            ? cleanText(r.getSenderOrg().getName())
            : "")
        .letterNumber(cleanText(r.getLetterNumber()))
        .date(effectiveDate(r))
        .direction(r.getDirection() != null ? r.getDirection().toString() : "")
        .subjectType(cleanText(r.getSubjectType()))
        .summary(cleanText(r.getSummary()))
        .description(cleanText(r.getDescription()))
        .build();
  }

  // ---------- Helpers ----------

  private LocalDate effectiveDate(MakhzanWaradaSadera r) {
    return r.getIncommingDate() != null ? r.getIncommingDate() : r.getOutgoingDate();
  }

  private Integer effectiveYear(MakhzanWaradaSadera r) {
    LocalDate date = effectiveDate(r);
    return date != null ? date.getYear() : null;
  }

  private Integer parseYear(String dateStr) {
    if (dateStr == null || dateStr.isBlank())
      return null;
    for (DateTimeFormatter fmt : DATE_FORMATS) {
      try {
        return LocalDate.parse(dateStr.trim(), fmt).getYear();
      } catch (DateTimeParseException ignored) {
        /* try next */ }
    }
    return null;
  }

  private boolean matchesYear(Integer year, Integer from, Integer to) {
    if (year == null)
      return from == null && to == null;
    if (from != null && year < from)
      return false;
    if (to != null && year > to)
      return false;
    return true;
  }

  private String cleanText(String text) {
    if (text == null)
      return "";
    return text.replace("\u200C", "").replace("\u064A", "\u06CC");
  }
}