package com.MCIT.ArchiveManagementSystem.models.StorageManagement;

import java.util.ArrayList;
import java.util.List;

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
import lombok.NoArgsConstructor;

// MakhzanWaradaSadera.java
@Entity
@Table(name = "makhzan_warada_sadera")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MakhzanWaradaSadera {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String no;
  @ManyToOne
  @JoinColumn(name = "org", nullable = false)
  private Org org;
  private String letterNumber;
  private String incommingDate;
  private String outgoingDate;
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