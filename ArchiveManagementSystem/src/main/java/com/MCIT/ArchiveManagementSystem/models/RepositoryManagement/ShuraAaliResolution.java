package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetFile;
import com.MCIT.ArchiveManagementSystem.models.enums.ShuraAliDirection;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "shura_aali_resolutions")
@Data
public class ShuraAaliResolution {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "send_date")
  private String sendDate;

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
  @ManyToOne
  @JoinColumn(name = "management_id")
  private Management management;

  @ManyToOne
  @JoinColumn(name = "cabinet_file_id")
  private CabinetFile cabinetFile;

}
