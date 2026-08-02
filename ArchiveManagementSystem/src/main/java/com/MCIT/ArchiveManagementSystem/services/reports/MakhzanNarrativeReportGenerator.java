package com.MCIT.ArchiveManagementSystem.services.reports;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.MCIT.ArchiveManagementSystem.dtos.reports.MakhzanReportDataDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeReportDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeSectionDTO;

@Component
public class MakhzanNarrativeReportGenerator {

    private static final String[] EASTERN_DIGITS = { "٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩" };

    public NarrativeReportDTO build(MakhzanReportDataDTO data) {
        String periodLabel = formatPeriod(data.getYearFrom(), data.getYearTo());

        String introduction = String.format(
                "گزارش مدیریت عمومی مخزن آمریت آرشیف %s قرار ذیل است.",
                periodLabel);

        List<NarrativeSectionDTO> sections = new ArrayList<>();
        sections.add(buildReceiptsSection(data));
        sections.add(buildWaradaSaderaSection(data));
        sections.add(buildAnnualReportsSection(data));
        sections.add(buildSubmissionReportsSection(data));

        String conclusion = String.format(
                "به این ترتیب، مجموعاً به تعداد (%s) قطعه سند و وثیقه توسط مدیریت عمومی مخزن آمریت آرشیف "
                        + "%s ثبت، بررسی و در محل مناسب جابجا گردیده است.",
                toDigits(data.getGrandTotal()), periodLabel);

        return NarrativeReportDTO.builder()
                .title("گزارش مدیریت عمومی مخزن آمریت آرشیف")
                .periodLabel(periodLabel)
                .introduction(introduction)
                .sections(sections)
                .conclusion(conclusion)
                .build();
    }

    private NarrativeSectionDTO buildReceiptsSection(MakhzanReportDataDTO data) {
        String body;
        if (data.getTotalReceipts() == 0) {
            body = "در جریان دوره تعیین شده هیچ رسید ثبت نگردیده است.";
        } else {
            body = String.format(
                    "به تعداد (%s) قطعه مکاتیب به مدیریت عمومی مخزن مواصلت ورزیده که بعد از ملاحظه و ثبت آن، "
                            + "به مراجع مربوطه اطلاع داده شده و در جای مناسب جابجا گردیده است.",
                    toDigits(data.getTotalReceipts()));
        }
        return NarrativeSectionDTO.builder().heading("الف: رسیدها").body(body).build();
    }

    private NarrativeSectionDTO buildWaradaSaderaSection(MakhzanReportDataDTO data) {
        long total = data.getTotalWarada() + data.getTotalSadera();
        String body;
        if (total == 0) {
            body = "در جریان دوره تعیین شده هیچ سند وارده یا صادره ثبت نگردیده است.";
        } else {
            body = String.format(
                    "به تعداد (%s) قطعه سند وارده و به تعداد (%s) قطعه سند صادره طی این دوره ثبت و پروسس گردیده است.",
                    toDigits(data.getTotalWarada()), toDigits(data.getTotalSadera()));
        }
        return NarrativeSectionDTO.builder().heading("ب: وارده و صادره").body(body).build();
    }

    private NarrativeSectionDTO buildAnnualReportsSection(MakhzanReportDataDTO data) {
        String body;
        if (data.getTotalAnnualReports() == 0) {
            body = "در جریان دوره تعیین شده هیچ راپور سالانه ثبت نگردیده است.";
        } else {
            body = String.format(
                    "به تعداد (%s) قطعه راپور سالانه از ولایات و مرکز غرض حفظ به مدیریت عمومی مخزن مواصلت "
                            + "ورزیده و در المارّی‌های مربوطه ترتیب و تنظیم گردیده است.",
                    toDigits(data.getTotalAnnualReports()));
        }
        return NarrativeSectionDTO.builder().heading("ج: راپورهای سالانه").body(body).build();
    }

    private NarrativeSectionDTO buildSubmissionReportsSection(MakhzanReportDataDTO data) {
        String body;
        if (data.getTotalSubmissionReports() == 0) {
            body = "در جریان دوره تعیین شده هیچ راپور تسلیمی ثبت نگردیده است.";
        } else {
            body = String.format(
                    "به تعداد (%s) قطعه راپور تسلیمی غرض حفظ به مدیریت عمومی مخزن مواصلت ورزیده و بعد از "
                            + "بررسی، در جای مناسب جابجا گردیده است.",
                    toDigits(data.getTotalSubmissionReports()));
        }
        return NarrativeSectionDTO.builder().heading("د: راپورهای تسلیمی").body(body).build();
    }

    private String formatPeriod(Integer from, Integer to) {
        if (from == null && to == null) return "از بابت تمام سال‌های موجود";
        if (from == null) return "الی سال " + toDigits(to);
        if (to == null) return "از سال " + toDigits(from) + " به بعد";
        if (from.equals(to)) return "از بابت سال " + toDigits(from) + " هـ ق";
        return "از سال " + toDigits(from) + " الی " + toDigits(to) + " هـ ق";
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