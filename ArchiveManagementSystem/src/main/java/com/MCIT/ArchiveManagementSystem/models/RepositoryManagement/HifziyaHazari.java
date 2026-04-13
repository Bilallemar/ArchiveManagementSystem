package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.Org;
import com.MCIT.ArchiveManagementSystem.models.SubType;
import com.MCIT.ArchiveManagementSystem.models.Type;
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
@Table(name = "hifziya_hazari")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HifziyaHazari {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String volume;

    @ManyToOne
    @JoinColumn(name = "type")
    private Type type;

    private Integer year;

    @ManyToOne
    @JoinColumn(name = "org")
    private Org org;
    @ManyToOne
    @JoinColumn(name = "sub_type_id")
    private SubType subType;
  @ManyToOne
    @JoinColumn(name = "management_id")
    private Management management;
    
    private String description;
    private Boolean isIndraj;

    @OneToMany(mappedBy = "hifziyaHazari", cascade = CascadeType.ALL, orphanRemoval = true)
  @ToString.Exclude // ADD THIS
    @EqualsAndHashCode.Exclude // ADD THIS
    private List<FileEntity> files = new ArrayList<>();

  @ManyToOne
  @JoinColumn(name = "cabinet_file_id")
  private CabinetFile cabinetFile;
}