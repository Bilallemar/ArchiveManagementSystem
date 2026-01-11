package com.MCIT.ArchiveManagementSystem.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrgStatsDTO {
    private String orgName;
    private Long archiveCount;
    private Long sawanihCount;
    private Long hifziyaHazariCount;
    private Long hifziyaWaradaSaderaCount;
    private Long makzanReceiptCount;
    private Long totalCount;
}