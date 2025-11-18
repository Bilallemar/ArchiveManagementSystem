package com.MCIT.ArchiveManagementSystem.models.StorageManagement;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "makzan_annual_report")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MakzanAnnualReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String address;
    private Integer year;
    private String docType;
    private String summaryWaseqa;
    private String description;
}


