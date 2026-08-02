package com.MCIT.ArchiveManagementSystem.dtos.reports;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NarrativeReportDTO {
    private String title;
    private String periodLabel;
    private String introduction;
    private List<NarrativeSectionDTO> sections;
    private String conclusion;
}