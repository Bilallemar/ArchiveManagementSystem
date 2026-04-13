package com.MCIT.ArchiveManagementSystem.models;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.MinotMakatib;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakhzanWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanAnnualReport;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String fileName;
        private String filePath;
        private String fileType;
        private Long fileSize;

        @ManyToOne
        @JoinColumn(name = "makzan_receipt_id")
        @JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private MakzanReceipt makzanReceipt;

        @ManyToOne
        @JoinColumn(name = "hifziya_warada_sadera_id")
        @JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private HifziyaWaradaSadera hifziyaWaradaSadera;

        @ManyToOne
        @JoinColumn(name = "hifziya_hazari_id")
        @JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private HifziyaHazari hifziyaHazari;

        @ManyToOne
        @JoinColumn(name = "makhzan_warada_sadera_id")
        @JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private MakhzanWaradaSadera makhzanWaradaSadera;
        @ManyToOne
        @JoinColumn(name = "sawanih_id")
        @JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private Sawanih sawanih;

        @ManyToOne
        @JoinColumn(name = "makzan_annual_report_id")
        @JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private MakzanAnnualReport makzanAnnualReport;

        @ManyToOne
        @JoinColumn(name = "makzan_submission_report_id")
        @JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private MakzanSubmissionReport makzanSubmissionReport;
        @ManyToOne
        @JoinColumn(name = "minot_makatib_id")
        @JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        private MinotMakatib minotMakatib;

}
