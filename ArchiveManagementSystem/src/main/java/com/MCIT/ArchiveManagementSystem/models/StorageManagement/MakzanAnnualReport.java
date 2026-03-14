package com.MCIT.ArchiveManagementSystem.models.StorageManagement;

import java.util.ArrayList;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.District;
import com.MCIT.ArchiveManagementSystem.models.DocType;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.Province;

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
@Table(name = "annual_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MakzanAnnualReport {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  @ManyToOne
  @JoinColumn(name = "management_id")
  private Management management;

  @ManyToOne
  @JoinColumn(name = "province_id")
  private Province province;

  @ManyToOne
  @JoinColumn(name = "district_id")
  private District district;

  private Integer year;
  @ManyToOne
  @JoinColumn(name = "doc_type_id")
  private DocType docType;
  private String summaryWaseqa;
  private String description;

  @OneToMany(mappedBy = "makzanAnnualReport", cascade = CascadeType.ALL, orphanRemoval = true)
  @ToString.Exclude // ADD THIS
  @EqualsAndHashCode.Exclude // ADD THIS
  private List<FileEntity> files = new ArrayList<>();
}
