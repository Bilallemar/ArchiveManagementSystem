package com.MCIT.ArchiveManagementSystem.services.reports;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.MCIT.ArchiveManagementSystem.dtos.reports.ArchiveReportDataDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.ArchiveReportRowDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeReportDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeSectionDTO;

@Component
public class NarrativeReportGenerator {

  private static final int TOP_N_DEPARTMENTS = 5;
  private static final String[] EASTERN_DIGITS = { "٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩" };

  public NarrativeReportDTO build(ArchiveReportDataDTO data) {
    String periodLabel = formatPeriod(data.getDateFrom(), data.getDateTo());
    List<ArchiveReportRowDTO> rows = data.getRows() != null ? data.getRows() : List.of();

    List<ArchiveReportRowDTO> incoming = rows.stream()
        .filter(r -> isDirection(r, "INCOMING"))
        .collect(Collectors.toList());
    List<ArchiveReportRowDTO> outgoing = rows.stream()
        .filter(r -> isDirection(r, "OUTGOING"))
        .collect(Collectors.toList());

    List<NarrativeSectionDTO> sections = new ArrayList<>();
    sections.add(buildIncomingSection(incoming));
    sections.add(buildOutgoingSection(outgoing));

    String introduction = String.format(
        "په تعداد (%s) قطعي مکتوبونه او پارسلونه %s د آرشیف مدیریت نه صادر او وارد شوي دي "
            + "چې ورسته له لازمو اجراآتو نه مربوطه شعباتو ته لاندې ډول لیږل شوي دي:",
        toPashtoDigits(data.getTotal()), periodLabel);

    String conclusion = String.format(
        "پورته آمار ښیي چې د آرشیف مدیریت %s په تعداد (%s) قطعي اسناد او پارسلونه "
            + "د اړوندو مقرراتو سره سم منظم ډول پروسس او مربوطه شعباتو ته لیږدولي دي.",
        periodLabel, toPashtoDigits(data.getTotal()));

    return NarrativeReportDTO.builder()
        .title("د آرشیف مدیریت راپور")
        .periodLabel(periodLabel)
        .introduction(introduction)
        .sections(sections)
        .conclusion(conclusion)
        .build();
  }

  // ---------- Sections ----------

  private NarrativeSectionDTO buildIncomingSection(List<ArchiveReportRowDTO> incoming) {
    if (incoming.isEmpty()) {
      return NarrativeSectionDTO.builder()
          .heading("الف: د واردو په برخه کي:")
          .body("د ټاکل شوي مهال په جریان کي هېڅ واردیز سند ثبت شوی نه دی.")
          .build();
    }

    Map<String, Long> byReceiver = groupAndCount(incoming, ArchiveReportRowDTO::getReceiverOrgName);
    String intro = String.format(
        "په تعداد (%s) قطعي مکتوبونه او پارسلونه دې مدیریت ته وارد شوي دي چې ورسته له لازمو "
            + "اجراآتو نه مربوطه شعبو ته لاندې ډول لیږل شوي دي:",
        toPashtoDigits(incoming.size()));

    String list = buildNumberedList(byReceiver);

    return NarrativeSectionDTO.builder()
        .heading("الف: د واردو په برخه کي:")
        .body(intro + "\n" + list)
        .build();
  }

  private NarrativeSectionDTO buildOutgoingSection(List<ArchiveReportRowDTO> outgoing) {
    if (outgoing.isEmpty()) {
      return NarrativeSectionDTO.builder()
          .heading("ب: د صادرو په برخه کي:")
          .body("د ټاکل شوي مهال په جریان کي هېڅ صادریز سند ثبت شوی نه دی.")
          .build();
    }

    Map<String, Long> byReceiver = groupAndCount(outgoing, ArchiveReportRowDTO::getReceiverOrgName);
    String intro = String.format(
        "په تعداد (%s) قطعي مکتوبونه او پارسلونه د آرشیف د مدیریت له طریقه اړوندو ادارو ته "
            + "صادر شوي دي چې ترکیب یې لاندې ډول دی:",
        toPashtoDigits(outgoing.size()));

    String list = buildNumberedList(byReceiver);

    return NarrativeSectionDTO.builder()
        .heading("ب: د صادرو په برخه کي:")
        .body(intro + "\n" + list)
        .build();
  }

  // ---------- Helpers ----------

  private boolean isDirection(ArchiveReportRowDTO row, String direction) {
    return row.getDirection() != null && row.getDirection().toUpperCase().contains(direction);
  }

  private Map<String, Long> groupAndCount(List<ArchiveReportRowDTO> rows,
      java.util.function.Function<ArchiveReportRowDTO, String> classifier) {
    return rows.stream()
        .map(classifier)
        .map(name -> (name == null || name.isBlank()) ? "نامشخصه اداره" : name)
        .collect(Collectors.groupingBy(n -> n, LinkedHashMap::new, Collectors.counting()));
  }

  private String buildNumberedList(Map<String, Long> counts) {
    List<Map.Entry<String, Long>> sorted = counts.entrySet().stream()
        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
        .collect(Collectors.toList());

    List<Map.Entry<String, Long>> top = sorted.stream()
        .limit(TOP_N_DEPARTMENTS)
        .collect(Collectors.toList());

    long othersCount = sorted.stream().skip(TOP_N_DEPARTMENTS).mapToLong(Map.Entry::getValue).sum();

    StringBuilder sb = new StringBuilder();
    int i = 1;
    for (Map.Entry<String, Long> entry : top) {
      sb.append(toPashtoDigits(i)).append("- ")
          .append("په تعداد (").append(toPashtoDigits(entry.getValue())).append(") قطعي مکتوبونه او پارسلونه ")
          .append("د لازم اجراآتو لپاره ").append(entry.getKey()).append(" ته لیږل شوي دي.")
          .append("\n");
      i++;
    }
    if (othersCount > 0) {
      sb.append(toPashtoDigits(i)).append("- ")
          .append("پاتې (").append(toPashtoDigits(othersCount)).append(") قطعي نورو شعباتو ته لیږل شوي دي.");
    }
    return sb.toString().stripTrailing();
  }

  private String toPashtoDigits(long n) {
    String s = String.valueOf(n);
    StringBuilder sb = new StringBuilder();
    for (char c : s.toCharArray()) {
      sb.append(Character.isDigit(c) ? EASTERN_DIGITS[c - '0'] : String.valueOf(c));
    }
    return sb.toString();
  }

  // NEW — overload for String input (used by formatPeriod for date strings like
  // "2026-07-26")
  private String toPashtoDigits(String s) {
    StringBuilder sb = new StringBuilder();
    for (char c : s.toCharArray()) {
      sb.append(Character.isDigit(c) ? EASTERN_DIGITS[c - '0'] : String.valueOf(c));
    }
    return sb.toString();
  }

  /**
   * Produces a Pashto period phrase based on whatever range was selected.
   */
  private String formatPeriod(LocalDate from, LocalDate to) {
    if (from == null && to == null) {
      return "د ټولو شتون لرونکو ریکارډونو لپاره";
    }
    if (from == null) {
      return "تر " + toPashtoDigits(dateNum(to)) + " پورې";
    }
    if (to == null) {
      return "د " + toPashtoDigits(dateNum(from)) + " نه وروسته";
    }
    if (from.equals(to)) {
      return "د " + toPashtoDigits(dateNum(from)) + " لپاره";
    }
    return "د " + toPashtoDigits(dateNum(from)) + " نه تر " + toPashtoDigits(dateNum(to)) + " پورې";
  }

  private String dateNum(LocalDate date) {
    return date.toString(); // yyyy-MM-dd, digits get converted to Eastern Arabic-Indic by toPashtoDigits
  }
}