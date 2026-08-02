package com.MCIT.ArchiveManagementSystem.models.StorageManagement;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.Auditable;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.Org;
import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetFile;
import com.MCIT.ArchiveManagementSystem.models.enums.MakhzanWaradaSaderaDirection;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

// MakhzanWaradaSadera.java
@Entity
@Table(name = "makhzan_warada_sadera")
@Data
@EqualsAndHashCode(callSuper = false)

@NoArgsConstructor
@AllArgsConstructor
public class MakhzanWaradaSadera extends Auditable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String no;
  @ManyToOne
  @JoinColumn(name = "receiver_org_id", nullable = false)
  private Org receiverOrg;

  @ManyToOne
  @JoinColumn(name = "sender_org_id", nullable = false)
  private Org senderOrg;
  private String letterNumber;
  private LocalDate incommingDate; // → LocalDate incommingDate;
  private LocalDate outgoingDate; // → LocalDate outgoingDate;
  private LocalDate senderOrgDate;
  private String summary;
  private String subjectType;
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private MakhzanWaradaSaderaDirection direction;

  @ManyToOne
  @JoinColumn(name = "management_id")
  private Management management;
  @OneToMany(mappedBy = "makhzanWaradaSadera", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<FileEntity> files = new ArrayList<>();

  @ManyToOne
  @JoinColumn(name = "cabinet_file_id")
  private CabinetFile cabinetFile;
}