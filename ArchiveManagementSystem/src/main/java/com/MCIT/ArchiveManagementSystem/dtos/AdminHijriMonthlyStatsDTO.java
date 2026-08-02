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
public class AdminHijriMonthlyStatsDTO {
    private int hijriYear;
    private List<String> months;        // 12 Hijri month names, in order
    private List<Integer> archiveData;   // 12 counts
    private List<Integer> hifziyaData;   // 12 counts
    private List<Integer> makhzanData;   // 12 counts
}