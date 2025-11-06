package com.MCIT.ArchiveManagementSystem.models.StorageManagement;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "annual_report_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnualReportInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    private String bookNumber;
    private String province;  
    private String district;
    private LocalDate year;  
    private String waseqaType;
    private String summaryOfWaseqa; 
    private String remarks;        
}
