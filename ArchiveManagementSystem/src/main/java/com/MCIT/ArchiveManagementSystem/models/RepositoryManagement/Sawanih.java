package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;

import java.time.LocalDate;
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
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sawanih")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sawanih {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String fatherName;
  private LocalDate incommingDate;
  private LocalDate outgoingDate;

    @ManyToOne
    @JoinColumn(name = "org")
    private Org org;

  @ManyToOne
    @JoinColumn(name = "management_id")
    private Management management;

    @OneToMany(mappedBy = "sawanih", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileEntity> files = new ArrayList<>();
  
    private String description;
    private Integer pageQuantity;
     private Boolean isSawanih;

  @ManyToOne
  @JoinColumn(name = "cabinet_file_id")
  private CabinetFile cabinetFile;
}

