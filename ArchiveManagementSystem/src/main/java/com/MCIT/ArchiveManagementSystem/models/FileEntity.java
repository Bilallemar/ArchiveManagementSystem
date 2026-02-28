package com.MCIT.ArchiveManagementSystem.models;


import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakhzanWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanAnnualReport;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

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
}

    // @ManyToOne
    // @JoinColumn(name = "receipt_id")
    // @JsonIgnore
    // private Receipts receipt;

    // @ManyToOne
    // @JoinColumn(name = "received_issued_book_id")
    // @JsonIgnore
    // private ReceivedIssuedBook receivedIssuedBook;

    // @ManyToOne
    // @JoinColumn(name = "attendance_book_id")
    // @JsonIgnore
    // private AttendanceBook attendanceBook;

    // @ManyToOne
    // @JoinColumn(name = "empoyment_office_id")
    // @JsonIgnore
    // private EmpoymentOffice empoymentOffice;

    // @ManyToOne
    // @JoinColumn(name = "archive_received_issued_book_id")
    // @JsonIgnore
    // private ArchiveReceivedIssuedBook archiveReceivedIssuedBook;

    // @ManyToOne
    // @JoinColumn(name = "registration_book_id")
    // @JsonIgnore
    // private RegistrationBook registrationBook;

    // @ManyToOne
    // @JoinColumn(name = "resolutions_and_memorandums_of_the_high_council_id")
    // @JsonIgnore
    // private ResolutionsAndMemorandumsOfTheHighCouncil resolutionsAndMemorandumsOfTheHighCouncil;

