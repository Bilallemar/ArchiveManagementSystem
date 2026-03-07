package com.MCIT.ArchiveManagementSystem.dtos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HifziyaHazariDTO {
      private Integer id;
    private String  volume;
    private Integer year;
    private String  typeName;      
    private String  subTypeName;   
    private String  orgName;       
    private Boolean isIndraj;
}
