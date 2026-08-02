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

import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeReportDTO;
import com.MCIT.ArchiveManagementSystem.dtos.reports.NarrativeSectionDTO;

@Component
public class HifziyaExcelReportGenerator {

  private static final String FONT_NAME = "Arial";
  private static final int SUMMARY_MERGE_COLS = 6;
  private static final int APPROX_CHARS_PER_LINE = 90;

  /**
   * Generates an Excel workbook containing only the narrative summary sheet
   * (لنډیز راپور) — no raw tabular data, matching the Makhzan report style.
   */
  public byte[] generate(NarrativeReportDTO narrative) {
    try (XSSFWorkbook workbook = new XSSFWorkbook();
        ByteArrayOutputStream os = new ByteArrayOutputStream()) {

      writeSummarySheet(workbook, narrative);

      workbook.write(os);
      return os.toByteArray();
    } catch (Exception e) {
      throw new RuntimeException("Failed to generate Excel report: " + e.getMessage(), e);
    }
  }

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
    rowIdx++;
    rowIdx = writeWrappedParagraph(sheet, rowIdx, narrative.getIntroduction(), bodyStyle);
    rowIdx++;

    if (narrative.getSections() != null) {
      for (NarrativeSectionDTO section : narrative.getSections()) {
        rowIdx = writeWrappedParagraph(sheet, rowIdx, section.getHeading(), headingStyle);
        rowIdx = writeWrappedParagraph(sheet, rowIdx, section.getBody(), bodyStyle);
        rowIdx++;
      }
    }

    rowIdx = writeWrappedParagraph(sheet, rowIdx, "پایله:", headingStyle);
    writeWrappedParagraph(sheet, rowIdx, narrative.getConclusion(), bodyStyle);

    for (int i = 0; i < 6; i++)
      sheet.setColumnWidth(i, 4500);
  }

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

  private Font baseFont(XSSFWorkbook wb, short size, boolean bold) {
    Font f = wb.createFont();
    f.setFontName(FONT_NAME);
    f.setFontHeightInPoints(size);
    f.setBold(bold);
    return f;
  }

  private CellStyle summaryTitleStyle(XSSFWorkbook wb) {
    CellStyle s = wb.createCellStyle();
    s.setFont(baseFont(wb, (short) 16, true));
    s.setAlignment(HorizontalAlignment.RIGHT);
    return s;
  }

  private CellStyle summaryPeriodStyle(XSSFWorkbook wb) {
    CellStyle s = wb.createCellStyle();
    Font f = baseFont(wb, (short) 11, false);
    f.setItalic(true);
    s.setFont(f);
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