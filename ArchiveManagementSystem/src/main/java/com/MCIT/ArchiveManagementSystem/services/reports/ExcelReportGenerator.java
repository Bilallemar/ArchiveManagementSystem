// package com.MCIT.ArchiveManagementSystem.services.reports;

// import java.io.ByteArrayOutputStream;
// import java.util.List;

// import org.apache.poi.ss.usermodel.BorderStyle;
// import org.apache.poi.ss.usermodel.Cell;
// import org.apache.poi.ss.usermodel.CellStyle;
// import org.apache.poi.ss.usermodel.FillPatternType;
// import org.apache.poi.ss.usermodel.Font;
// import org.apache.poi.ss.usermodel.HorizontalAlignment;
// import org.apache.poi.ss.usermodel.IndexedColors;
// import org.apache.poi.ss.usermodel.Row;
// import org.apache.poi.ss.usermodel.VerticalAlignment;
// import org.apache.poi.ss.util.CellRangeAddress;
// import org.apache.poi.xssf.usermodel.XSSFSheet;
// import org.apache.poi.xssf.usermodel.XSSFWorkbook;
// import org.springframework.stereotype.Component;

// import com.MCIT.ArchiveManagementSystem.dtos.reports.ArchiveReportDataDTO;
// import com.MCIT.ArchiveManagementSystem.dtos.reports.ArchiveReportRowDTO;
// import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeReportDTO;
// import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeSectionDTO;

// import lombok.RequiredArgsConstructor;

// @Component
// @RequiredArgsConstructor
// public class ExcelReportGenerator {

//     private static final String FONT_NAME = "Arial";
//     private static final String[] HEADERS = {
//             "#", "د لیک شمېره", "مرسل", "مرسل الیه", "نوعیت", "سمت", "د ارسال نیټه", "ملاحظات"
//     };
//     private static final int SUMMARY_MERGE_COLS = 6;
//     private static final int APPROX_CHARS_PER_LINE = 90;

//     public byte[] generate(ArchiveReportDataDTO data, NarrativeReportDTO narrative) {
//         try (XSSFWorkbook workbook = new XSSFWorkbook();
//              ByteArrayOutputStream os = new ByteArrayOutputStream()) {

//             writeDataSheet(workbook, data);
//             writeSummarySheet(workbook, narrative);

//             workbook.write(os);
//             return os.toByteArray();
//         } catch (Exception e) {
//             throw new RuntimeException("Failed to generate Excel report: " + e.getMessage(), e);
//         }
//     }

//     // ---------------- Data sheet ----------------

//     private void writeDataSheet(XSSFWorkbook workbook, ArchiveReportDataDTO data) {
//         XSSFSheet sheet = workbook.createSheet("د آرشیف راپور");
//         sheet.setRightToLeft(true);

//         CellStyle titleStyle = titleStyle(workbook);
//         CellStyle metaStyle = metaStyle(workbook);
//         CellStyle headerStyle = headerStyle(workbook);
//         CellStyle cellStyle = cellStyle(workbook);
//         CellStyle summaryValueStyle = summaryStyle(workbook, true);

//         int rowIdx = 0;

//         Row titleRow = sheet.createRow(rowIdx++);
//         titleRow.setHeightInPoints(24);
//         Cell titleCell = titleRow.createCell(0);
//         titleCell.setCellValue("د آرشیف راپور");
//         titleCell.setCellStyle(titleStyle);
//         sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, HEADERS.length - 1));

//         Row metaRow = sheet.createRow(rowIdx++);
//         Cell metaCell = metaRow.createCell(0);
//         metaCell.setCellValue(buildMetaLine(data));
//         metaCell.setCellStyle(metaStyle);
//         sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, HEADERS.length - 1));

//         rowIdx++; // spacer

//         Row headerRow = sheet.createRow(rowIdx++);
//         for (int i = 0; i < HEADERS.length; i++) {
//             Cell cell = headerRow.createCell(i);
//             cell.setCellValue(HEADERS[i]);
//             cell.setCellStyle(headerStyle);
//         }

//         List<ArchiveReportRowDTO> rows = data.getRows();
//         int counter = 1;
//         for (ArchiveReportRowDTO row : rows) {
//             Row dataRow = sheet.createRow(rowIdx++);
//             writeCell(dataRow, 0, counter++, cellStyle);
//             writeCell(dataRow, 1, row.getDocNo(), cellStyle);
//             writeCell(dataRow, 2, row.getSenderOrgName(), cellStyle);
//             writeCell(dataRow, 3, row.getReceiverOrgName(), cellStyle);
//             writeCell(dataRow, 4, row.getDocTypeName(), cellStyle);
//             writeCell(dataRow, 5, translateDirection(row.getDirection()), cellStyle);
//             writeCell(dataRow, 6, row.getSendDate() != null ? row.getSendDate().toString() : "", cellStyle);
//             writeCell(dataRow, 7, row.getDescription(), cellStyle);
//         }

//         rowIdx++; // spacer

//         Row totalRow = sheet.createRow(rowIdx++);
//         Cell totalCell = totalRow.createCell(0);
//         totalCell.setCellValue("ټول اسناد: " + data.getTotal());
//         totalCell.setCellStyle(summaryValueStyle);
//         sheet.addMergedRegion(
//                 new CellRangeAddress(totalRow.getRowNum(), totalRow.getRowNum(), 0, HEADERS.length - 1));

//         Row inOutRow = sheet.createRow(rowIdx++);
//         Cell inOutCell = inOutRow.createCell(0);
//         inOutCell.setCellValue(
//                 "واردات: " + data.getTotalIncoming() + "   |   صادرات: " + data.getTotalOutgoing());
//         inOutCell.setCellStyle(summaryValueStyle);
//         sheet.addMergedRegion(
//                 new CellRangeAddress(inOutRow.getRowNum(), inOutRow.getRowNum(), 0, HEADERS.length - 1));

//         int[] widths = { 2000, 4500, 5500, 5500, 4000, 3000, 3500, 9000 };
//         for (int i = 0; i < widths.length; i++) {
//             sheet.setColumnWidth(i, widths[i]);
//         }
//     }

//     // ---------------- Summary sheet (Pashto narrative, RTL) ----------------

//     private void writeSummarySheet(XSSFWorkbook workbook, NarrativeReportDTO narrative) {
//         XSSFSheet sheet = workbook.createSheet("لنډیز راپور");
//         sheet.setRightToLeft(true);

//         CellStyle titleStyle = summaryTitleStyle(workbook);
//         CellStyle periodStyle = summaryPeriodStyle(workbook);
//         CellStyle headingStyle = summaryHeadingStyle(workbook);
//         CellStyle bodyStyle = summaryBodyStyle(workbook);

//         int rowIdx = 0;

//         rowIdx = writeWrappedParagraph(sheet, rowIdx, narrative.getTitle(), titleStyle);
//         rowIdx = writeWrappedParagraph(sheet, rowIdx, narrative.getPeriodLabel(), periodStyle);
//         rowIdx++; // spacer

//         rowIdx = writeWrappedParagraph(sheet, rowIdx, narrative.getIntroduction(), bodyStyle);
//         rowIdx++; // spacer

//         if (narrative.getSections() != null) {
//             for (NarrativeSectionDTO section : narrative.getSections()) {
//                 rowIdx = writeWrappedParagraph(sheet, rowIdx, section.getHeading(), headingStyle);
//                 rowIdx = writeWrappedParagraph(sheet, rowIdx, section.getBody(), bodyStyle);
//                 rowIdx++; // spacer
//             }
//         }

//         rowIdx = writeWrappedParagraph(sheet, rowIdx, "پایله:", headingStyle);
//         writeWrappedParagraph(sheet, rowIdx, narrative.getConclusion(), bodyStyle);

//         int[] widths = { 4500, 4500, 4500, 4500, 4500, 4500 };
//         for (int i = 0; i < widths.length; i++) {
//             sheet.setColumnWidth(i, widths[i]);
//         }
//     }

//     /**
//      * Writes a single merged, word-wrapped paragraph, honoring existing \n
//      * line breaks (used by numbered lists) when estimating row height.
//      */
//     private int writeWrappedParagraph(XSSFSheet sheet, int rowIdx, String text, CellStyle style) {
//         String safeText = text != null ? text : "";
//         Row row = sheet.createRow(rowIdx);
//         Cell cell = row.createCell(0);
//         cell.setCellValue(safeText);
//         cell.setCellStyle(style);
//         sheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 0, SUMMARY_MERGE_COLS - 1));

//         int lines = 0;
//         for (String part : safeText.split("\n", -1)) {
//             lines += Math.max(1, (int) Math.ceil(part.length() / (double) APPROX_CHARS_PER_LINE));
//         }
//         lines = Math.max(1, lines);
//         row.setHeightInPoints(Math.max(18f, lines * 16f));

//         return rowIdx + 1;
//     }

//     // ---------------- Shared cell writer ----------------

//     private void writeCell(Row row, int col, Object value, CellStyle style) {
//         Cell cell = row.createCell(col);
//         if (value instanceof Integer i) {
//             cell.setCellValue(i);
//         } else {
//             cell.setCellValue(value != null ? value.toString() : "");
//         }
//         cell.setCellStyle(style);
//     }

//     private String buildMetaLine(ArchiveReportDataDTO data) {
//         StringBuilder sb = new StringBuilder();
//         sb.append("اداره: ").append(data.getManagementName())
//           .append(" | د راپور نیټه: ").append(data.getGeneratedOn());
//         if (data.getDateFrom() != null) {
//             sb.append(" | د ").append(data.getDateFrom())
//               .append(" څخه تر ").append(data.getDateTo()).append(" پورې");
//         }
//         return sb.toString();
//     }

//     private String translateDirection(String direction) {
//         if (direction == null) return "";
//         String upper = direction.toUpperCase();
//         if (upper.contains("INCOMING")) return "واردات";
//         if (upper.contains("OUTGOING")) return "صادرات";
//         return direction;
//     }

//     // ---------------- Fonts & styles ----------------

//     private Font baseFont(XSSFWorkbook workbook, short size, boolean bold) {
//         Font font = workbook.createFont();
//         font.setFontName(FONT_NAME);
//         font.setFontHeightInPoints(size);
//         font.setBold(bold);
//         return font;
//     }

//     private CellStyle titleStyle(XSSFWorkbook wb) {
//         CellStyle s = wb.createCellStyle();
//         s.setFont(baseFont(wb, (short) 16, true));
//         s.setAlignment(HorizontalAlignment.CENTER);
//         return s;
//     }

//     private CellStyle metaStyle(XSSFWorkbook wb) {
//         CellStyle s = wb.createCellStyle();
//         s.setFont(baseFont(wb, (short) 10, false));
//         s.setAlignment(HorizontalAlignment.CENTER);
//         return s;
//     }

//     private CellStyle headerStyle(XSSFWorkbook wb) {
//         CellStyle s = wb.createCellStyle();
//         s.setFont(baseFont(wb, (short) 11, true));
//         s.setAlignment(HorizontalAlignment.RIGHT);
//         s.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
//         s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
//         applyThinBorders(s);
//         return s;
//     }

//     private CellStyle cellStyle(XSSFWorkbook wb) {
//         CellStyle s = wb.createCellStyle();
//         s.setFont(baseFont(wb, (short) 10, false));
//         s.setAlignment(HorizontalAlignment.RIGHT);
//         applyThinBorders(s);
//         return s;
//     }

//     private CellStyle summaryStyle(XSSFWorkbook wb, boolean bold) {
//         CellStyle s = wb.createCellStyle();
//         s.setFont(baseFont(wb, (short) 11, bold));
//         s.setAlignment(HorizontalAlignment.RIGHT);
//         return s;
//     }

//     private CellStyle summaryTitleStyle(XSSFWorkbook wb) {
//         CellStyle s = wb.createCellStyle();
//         s.setFont(baseFont(wb, (short) 16, true));
//         s.setAlignment(HorizontalAlignment.RIGHT);
//         s.setVerticalAlignment(VerticalAlignment.CENTER);
//         return s;
//     }

//     private CellStyle summaryPeriodStyle(XSSFWorkbook wb) {
//         CellStyle s = wb.createCellStyle();
//         Font font = baseFont(wb, (short) 11, false);
//         font.setItalic(true);
//         s.setFont(font);
//         s.setAlignment(HorizontalAlignment.RIGHT);
//         return s;
//     }

//     private CellStyle summaryHeadingStyle(XSSFWorkbook wb) {
//         CellStyle s = wb.createCellStyle();
//         s.setFont(baseFont(wb, (short) 12, true));
//         s.setAlignment(HorizontalAlignment.RIGHT);
//         s.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
//         s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
//         return s;
//     }

//     private CellStyle summaryBodyStyle(XSSFWorkbook wb) {
//         CellStyle s = wb.createCellStyle();
//         s.setFont(baseFont(wb, (short) 11, false));
//         s.setAlignment(HorizontalAlignment.RIGHT);
//         s.setVerticalAlignment(VerticalAlignment.TOP);
//         s.setWrapText(true);
//         return s;
//     }

//     private void applyThinBorders(CellStyle s) {
//         s.setBorderTop(BorderStyle.THIN);
//         s.setBorderBottom(BorderStyle.THIN);
//         s.setBorderLeft(BorderStyle.THIN);
//         s.setBorderRight(BorderStyle.THIN);
//     }
// }

package com.MCIT.ArchiveManagementSystem.services.reports;

import java.io.ByteArrayOutputStream;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import com.MCIT.ArchiveManagementSystem.dtos.reports.ArchiveReportDataDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeReportDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeSectionDTO;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExcelReportGenerator {

    private static final String FONT_NAME = "Arial";
    private static final int SUMMARY_MERGE_COLS = 6;
    private static final int APPROX_CHARS_PER_LINE = 90;

    /**
     * Generates an Excel workbook containing only the narrative summary sheet
     * (لنډیز راپور). The raw tabular data (ArchiveReportDataDTO) is accepted
     * for backward compatibility with callers but is no longer rendered.
     */
    public byte[] generate(ArchiveReportDataDTO data, NarrativeReportDTO narrative) {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream os = new ByteArrayOutputStream()) {

            writeSummarySheet(workbook, narrative);

            workbook.write(os);
            return os.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel report: " + e.getMessage(), e);
        }
    }

    // ---------------- Summary sheet (Pashto narrative, RTL) ----------------

    private void writeSummarySheet(XSSFWorkbook workbook, NarrativeReportDTO narrative) {
        XSSFSheet sheet = workbook.createSheet("لنډیز راپور");
        sheet.setRightToLeft(true);

        CellStyle titleStyle = summaryTitleStyle(workbook);
        CellStyle periodStyle = summaryPeriodStyle(workbook);
        CellStyle headingStyle = summaryHeadingStyle(workbook);
        CellStyle bodyStyle = summaryBodyStyle(workbook);

        int rowIdx = 0;

        rowIdx = writeWrappedParagraph(sheet, rowIdx, narrative.getTitle(), titleStyle);
        rowIdx = writeWrappedParagraph(sheet, rowIdx, narrative.getPeriodLabel(), periodStyle);
        rowIdx++; // spacer

        rowIdx = writeWrappedParagraph(sheet, rowIdx, narrative.getIntroduction(), bodyStyle);
        rowIdx++; // spacer

        if (narrative.getSections() != null) {
            for (NarrativeSectionDTO section : narrative.getSections()) {
                rowIdx = writeWrappedParagraph(sheet, rowIdx, section.getHeading(), headingStyle);
                rowIdx = writeWrappedParagraph(sheet, rowIdx, section.getBody(), bodyStyle);
                rowIdx++; // spacer
            }
        }

        rowIdx = writeWrappedParagraph(sheet, rowIdx, "پایله:", headingStyle);
        writeWrappedParagraph(sheet, rowIdx, narrative.getConclusion(), bodyStyle);

        int[] widths = { 4500, 4500, 4500, 4500, 4500, 4500 };
        for (int i = 0; i < widths.length; i++) {
            sheet.setColumnWidth(i, widths[i]);
        }
    }

    /**
     * Writes a single merged, word-wrapped paragraph, honoring existing \n
     * line breaks (used by numbered lists) when estimating row height.
     */
    private int writeWrappedParagraph(XSSFSheet sheet, int rowIdx, String text, CellStyle style) {
        String safeText = text != null ? text : "";
        Row row = sheet.createRow(rowIdx);
        Cell cell = row.createCell(0);
        cell.setCellValue(safeText);
        cell.setCellStyle(style);
        sheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 0, SUMMARY_MERGE_COLS - 1));

        int lines = 0;
        for (String part : safeText.split("\n", -1)) {
            lines += Math.max(1, (int) Math.ceil(part.length() / (double) APPROX_CHARS_PER_LINE));
        }
        lines = Math.max(1, lines);
        row.setHeightInPoints(Math.max(18f, lines * 16f));

        return rowIdx + 1;
    }

    // ---------------- Fonts & styles ----------------

    private Font baseFont(XSSFWorkbook workbook, short size, boolean bold) {
        Font font = workbook.createFont();
        font.setFontName(FONT_NAME);
        font.setFontHeightInPoints(size);
        font.setBold(bold);
        return font;
    }

    private CellStyle summaryTitleStyle(XSSFWorkbook wb) {
        CellStyle s = wb.createCellStyle();
        s.setFont(baseFont(wb, (short) 16, true));
        s.setAlignment(HorizontalAlignment.RIGHT);
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        return s;
    }

    private CellStyle summaryPeriodStyle(XSSFWorkbook wb) {
        CellStyle s = wb.createCellStyle();
        Font font = baseFont(wb, (short) 11, false);
        font.setItalic(true);
        s.setFont(font);
        s.setAlignment(HorizontalAlignment.RIGHT);
        return s;
    }

    private CellStyle summaryHeadingStyle(XSSFWorkbook wb) {
        CellStyle s = wb.createCellStyle();
        s.setFont(baseFont(wb, (short) 12, true));
        s.setAlignment(HorizontalAlignment.RIGHT);
        s.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return s;
    }

    private CellStyle summaryBodyStyle(XSSFWorkbook wb) {
        CellStyle s = wb.createCellStyle();
        s.setFont(baseFont(wb, (short) 11, false));
        s.setAlignment(HorizontalAlignment.RIGHT);
        s.setVerticalAlignment(VerticalAlignment.TOP);
        s.setWrapText(true);
        return s;
    }
}