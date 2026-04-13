package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;

import java.util.ArrayList;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.Org;
import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetFile;
import com.MCIT.ArchiveManagementSystem.models.enums.HifziyaWaradaSaderaDirection;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
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

// HifziyaWaradaSadera.java
@Entity
@Table(name = "hifziya_warada_sadera")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HifziyaWaradaSadera {
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
    private HifziyaWaradaSaderaDirection direction;

    @ManyToOne
    @JoinColumn(name = "management_id")
    private Management management;

    
// In HifziyaWaradaSadera.java
@OneToMany(mappedBy = "hifziyaWaradaSadera", 
           cascade = CascadeType.ALL, 
           orphanRemoval = true,
           fetch = FetchType.EAGER)                                    // ✅
@JsonIgnoreProperties({"hifziyaWaradaSadera", "hibernateLazyInitializer"})  // ✅
    private List<FileEntity> files = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "cabinet_file_id")
    private CabinetFile cabinetFile;
}
