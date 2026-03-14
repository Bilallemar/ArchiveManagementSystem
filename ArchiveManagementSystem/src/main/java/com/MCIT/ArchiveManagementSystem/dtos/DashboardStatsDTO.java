package com.MCIT.ArchiveManagementSystem.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {

    // Chart data - months in YYYY-MM format
    private List<String> months;
    private List<Integer> fileData; // total docs per month
    private List<Integer> waradaData; // ✅ NEW - warada per month
    private List<Integer> saderaData; // ✅ NEW - sadera per month
    private List<Integer> senderData; // keep for compatibility
    private List<Integer> recipientData; // keep for compatibility

    // Admin cards
    private long totalArchive;
    private long totalHifziya;
    private long totalMakhzan;
    private long totalDocuments;

    // Archive manager cards
    private long totalWarada; // ✅ NEW
    private long totalSadera; // ✅ NEW

    // Hifziya manager cards
    private long totalSawanih; // ✅ NEW
    private long totalHifziyaHazari; // ✅ NEW
    private long totalHifziyaWaradaSadera;// ✅ NEW

    // Makhzan manager cards
    private long totalMakzanReceipt; // ✅ NEW
    private long totalAnnualReport; // ✅ NEW
    private long totalSubmissionReport; // ✅ NEW

    // Keep old fields
    private int totalSender;
    private int totalRecipient;
    private int totalFile;

    private WeeklyDataDTO weeklyData;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyDataDTO {
        private int sender;
        private int recipient;
        private int file;
    }
}