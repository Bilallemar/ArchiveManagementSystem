package com.MCIT.ArchiveManagementSystem.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private List<String> months;
    private List<Integer> senderData;
    private List<Integer> recipientData;
    private List<Integer> fileData;
    private Integer totalSender;
    private Integer totalRecipient;
    private Integer totalFile;
    private WeeklyDataDTO weeklyData;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyDataDTO {
        private Integer sender;
        private Integer recipient;
        private Integer file;
    }
}