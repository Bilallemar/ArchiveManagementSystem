package com.MCIT.ArchiveManagementSystem.models.StorageManagement;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "makzan_submission_report")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MakzanSubmissionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String address;
    private Integer year;
    private String docType;
    private String summaryWaseqa;
    private String description;
}
