package com.MCIT.ArchiveManagementSystem.services.reports;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.dtos.reports.HifziyaReportDataDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeReportDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.repositories.ManagementRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaHazariRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaWaradaSaderaRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.SawanihRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HifziyaReportService {

  private static final String HIFZIYA_MANAGEMENT_NAME = "Hifziya";
  private static final int TOP_N = 5;

  private final SawanihRepository sawanihRepository;
  private final HifziyaHazariRepository hifziyaHazariRepository;
  private final HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository;
  private final ManagementRepository managementRepository;
  private final HifziyaExcelReportGenerator excelReportGenerator;
  private final HifziyaNarrativeReportGenerator narrativeReportGenerator;

  private static final DateTimeFormatter[] DATE_FORMATS = {
      DateTimeFormatter.ofPattern("yyyy-MM-dd"),
      DateTimeFormatter.ofPattern("yyyy/MM/dd"),
      DateTimeFormatter.ofPattern("dd-MM-yyyy"),
      DateTimeFormatter.ofPattern("dd/MM/yyyy"),
  };

  public HifziyaReportDataDTO buildReportData(Integer yearFrom, Integer yearTo) {
    Management management = managementRepository.findByManagementName(HIFZIYA_MANAGEMENT_NAME)
        .orElseThrow(() -> new RuntimeException("Hifziya management not found"));

    List<Sawanih> sawanihList = sawanihRepository.findByManagement(management).stream()
        .filter(s -> matchesYear(sawanihYear(s), yearFrom, yearTo))
        .collect(Collectors.toList());

    List<HifziyaHazari> allHazari = hifziyaHazariRepository.findByManagement(management).stream()
        .filter(h -> matchesYear(h.getYear(), yearFrom, yearTo))
        .collect(Collectors.toList());

    List<HifziyaHazari> hazariList = allHazari.stream()
        .filter(h -> h.getIsIndraj() == null || !h.getIsIndraj())
        .collect(Collectors.toList());

    List<HifziyaHazari> indrajList = allHazari.stream()
        .filter(h -> h.getIsIndraj() != null && h.getIsIndraj())
        .collect(Collectors.toList());

    List<HifziyaWaradaSadera> waradaSaderaList = hifziyaWaradaSaderaRepository.findByManagement(management).stream()
        .filter(w -> matchesYear(effectiveYear(w), yearFrom, yearTo))
        .collect(Collectors.toList());

    long totalIncoming = waradaSaderaList.stream()
        .filter(w -> w.getDirection() != null && w.getDirection().toString().toUpperCase().contains("INCOMING"))
        .count();
    long totalOutgoing = waradaSaderaList.stream()
        .filter(w -> w.getDirection() != null && w.getDirection().toString().toUpperCase().contains("OUTGOING"))
        .count();

    long grandTotal = sawanihList.size() + hazariList.size() + indrajList.size() + waradaSaderaList.size();

    Map<String, Long> sawanihByOrg = groupByOrgName(sawanihList, s -> s.getOrg() != null ? s.getOrg().getName() : null);
    Map<String, Long> hazariByOrg = groupByOrgName(hazariList, h -> h.getOrg() != null ? h.getOrg().getName() : null);
    Map<String, Long> indrajByOrg = groupByOrgName(indrajList, h -> h.getOrg() != null ? h.getOrg().getName() : null);
    Map<String, Long> waradaSaderaByOrg = groupByOrgName(waradaSaderaList,
        w -> w.getReceiverOrg() != null ? w.getReceiverOrg().getName() : null);

    return HifziyaReportDataDTO.builder()
        .managementName(management.getManagementName())
        .yearFrom(yearFrom)
        .yearTo(yearTo)
        .generatedOn(LocalDate.now().toString())
        .totalSawanih(sawanihList.size())
        .totalHazari(hazariList.size())
        .totalIndraj(indrajList.size())
        .totalWaradaSaderaIncoming(totalIncoming)
        .totalWaradaSaderaOutgoing(totalOutgoing)
        .grandTotal(grandTotal)
        .sawanihByOrg(sawanihByOrg)
        .hazariByOrg(hazariByOrg)
        .indrajByOrg(indrajByOrg)
        .waradaSaderaByOrg(waradaSaderaByOrg)
        .build();
  }

  public byte[] generateExcel(Integer yearFrom, Integer yearTo) {
    HifziyaReportDataDTO data = buildReportData(yearFrom, yearTo);
    NarrativeReportDTO narrative = narrativeReportGenerator.build(data);
    return excelReportGenerator.generate(narrative);
  }

  // ---------- Helpers ----------

  private Integer sawanihYear(Sawanih s) {
    if (s.getIncommingDate() != null)
      return s.getIncommingDate().getYear();
    if (s.getOutgoingDate() != null)
      return s.getOutgoingDate().getYear();
    return null;
  }

  private Integer effectiveYear(HifziyaWaradaSadera w) {
    LocalDate date = w.getIncommingDate() != null ? w.getIncommingDate() : w.getOutgoingDate();
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

  private <T> Map<String, Long> groupByOrgName(List<T> items, java.util.function.Function<T, String> nameExtractor) {
    Map<String, Long> counts = items.stream()
        .map(nameExtractor)
        .map(name -> (name == null || name.isBlank()) ? "نامعلومه اداره" : name)
        .collect(Collectors.groupingBy(n -> n, LinkedHashMap::new, Collectors.counting()));

    return counts.entrySet().stream()
        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
        .limit(TOP_N)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new));
  }
}