package com.MCIT.ArchiveManagementSystem.dtos.reports;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MakhzanWaradaSaderaRowDTO {
    private String no;
    private String orgName;
    private String letterNumber;
    private LocalDate date; // incoming or outgoing date, whichever applies
    private String direction;
    private String subjectType;
    private String summary;
    private String description;
}