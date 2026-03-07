package com.MCIT.ArchiveManagementSystem.dtos;


import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SawanihSummaryDTO {

  private Integer id;
  private String name;
  private String fatherName;
  private LocalDate incommingDate;
  private String orgName;
  private Boolean isSawanih;

}
