package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

import com.MCIT.ArchiveManagementSystem.models.enums.ShuraAliDirection;

@Entity
@Table(name = "shura_aali_resolutions")
@Data
public class ShuraAaliResolution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "send_date")
    private LocalDate sendDate;

    private String subject;

    @Column(name = "sender_reference")
    private String senderReference;

    private String title;
    private String resolutionType;

@Enumerated(EnumType.STRING)
private ShuraAliDirection direction;


    @Column(name = "letter_number")
    private String letterNumber;

    @Column(name = "resolution_number")
    private String resolutionNo;

    @Column(name = "approval_year")
    private Integer approvalYear;

    @Column(length = 2000)
    private String remarks;
}
