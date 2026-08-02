package com.MCIT.ArchiveManagementSystem.services.reports;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.MCIT.ArchiveManagementSystem.dtos.reports.HifziyaReportDataDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeReportDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeSectionDTO;

@Component
public class HifziyaNarrativeReportGenerator {

  private static final String[] EASTERN_DIGITS = { "٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩" };

  public NarrativeReportDTO build(HifziyaReportDataDTO data) {
    String periodLabel = formatPeriod(data.getYearFrom(), data.getYearTo());

    String introduction = String.format(
        "د حفظیه مدیریت راپور %s قرار لاندې دی چې ټول شمېر (%s) قطعي اسناد رانغاړي:",
        periodLabel, toDigits(data.getGrandTotal()));

    List<NarrativeSectionDTO> sections = new ArrayList<>();
    sections.add(buildSection("الف: سوانح", data.getTotalSawanih(), data.getSawanihByOrg(),
        "هېڅ د سوانح سند ثبت شوی نه دی."));
    sections.add(buildSection("ب: حضري", data.getTotalHazari(), data.getHazariByOrg(),
        "هېڅ د حضري سند ثبت شوی نه دی."));
    sections.add(buildSection("ج: انداج", data.getTotalIndraj(), data.getIndrajByOrg(),
        "هېڅ د انداج سند ثبت شوی نه دی."));
    sections.add(buildWaradaSaderaSection(data));

    String conclusion = String.format(
        "پورته آمار ښیي چې د حفظیه مدیریت %s په ټوليز ډول (%s) قطعي اسناد سره سم منظم ډول "
            + "ثبت، ساتنه او مربوطه شعباتو ته لیږدولي دي.",
        periodLabel, toDigits(data.getGrandTotal()));

    return NarrativeReportDTO.builder()
        .title("د حفظیه مدیریت راپور")
        .periodLabel(periodLabel)
        .introduction(introduction)
        .sections(sections)
        .conclusion(conclusion)
        .build();
  }

  private NarrativeSectionDTO buildSection(String heading, long total, Map<String, Long> byOrg, String emptyMsg) {
    String body;
    if (total == 0) {
      body = emptyMsg;
    } else {
      String intro = String.format("په تعداد (%s) قطعي اسناد ثبت شوي دي چې ترکیب یې لاندې ډول دی:",
          toDigits(total));
      String list = buildNumberedList(byOrg);
      body = intro + "\n" + list;
    }
    return NarrativeSectionDTO.builder().heading(heading).body(body).build();
  }

  private NarrativeSectionDTO buildWaradaSaderaSection(HifziyaReportDataDTO data) {
    long total = data.getTotalWaradaSaderaIncoming() + data.getTotalWaradaSaderaOutgoing();
    String body;
    if (total == 0) {
      body = "هېڅ د واردې یا صادرې سند ثبت شوی نه دی.";
    } else {
      String intro = String.format(
          "په تعداد (%s) قطعي واردات او په تعداد (%s) قطعي صادرات ثبت شوي دي چې ترکیب یې لاندې ډول دی:",
          toDigits(data.getTotalWaradaSaderaIncoming()), toDigits(data.getTotalWaradaSaderaOutgoing()));
      String list = buildNumberedList(data.getWaradaSaderaByOrg());
      body = intro + "\n" + list;
    }
    return NarrativeSectionDTO.builder().heading("د: واردات او صادرات").body(body).build();
  }

  private String buildNumberedList(Map<String, Long> byOrg) {
    if (byOrg == null || byOrg.isEmpty())
      return "";
    StringBuilder sb = new StringBuilder();
    int i = 1;
    for (Map.Entry<String, Long> entry : byOrg.entrySet()) {
      sb.append(toDigits(i)).append("- ")
          .append("په تعداد (").append(toDigits(entry.getValue())).append(") قطعي اسناد ")
          .append(entry.getKey()).append(" سره تړاو لري.")
          .append("\n");
      i++;
    }
    return sb.toString().stripTrailing();
  }

  private String formatPeriod(Integer from, Integer to) {
    if (from == null && to == null)
      return "د ټولو شتون لرونکو ریکارډونو لپاره";
    if (from == null)
      return "تر " + toDigits(to) + " پورې";
    if (to == null)
      return "د " + toDigits(from) + " نه وروسته";
    if (from.equals(to))
      return "د " + toDigits(from) + " کال لپاره";
    return "د " + toDigits(from) + " نه تر " + toDigits(to) + " پورې";
  }

  private String toDigits(long n) {
    String s = String.valueOf(n);
    StringBuilder sb = new StringBuilder();
    for (char c : s.toCharArray()) {
      sb.append(Character.isDigit(c) ? EASTERN_DIGITS[c - '0'] : String.valueOf(c));
    }
    return sb.toString();
  }
}