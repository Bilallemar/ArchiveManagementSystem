package com.MCIT.ArchiveManagementSystem.models.StorageManagement;

import java.util.ArrayList;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.Org;
import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetFile;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
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
import lombok.ToString;

@Entity
@Table(name = "makzan_receipt")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MakzanReceipt {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String docNo;
  private String department;

  @ManyToOne
  @JoinColumn(name = "org")
  private Org org;
  @ManyToOne
  @JoinColumn(name = "management_id")
  private Management management;

  private String letterNo;
  private String letterDate;
  private String subjectType;
  private String description;

  @OneToMany(mappedBy = "makzanReceipt", cascade = CascadeType.ALL, orphanRemoval = true)
  @ToString.Exclude // ADD THIS
  @EqualsAndHashCode.Exclude // ADD THIS
  private List<FileEntity> files = new ArrayList<>();

  @ManyToOne
  @JoinColumn(name = "cabinet_file_id")
  private CabinetFile cabinetFile;
}
