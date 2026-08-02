package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.Auditable;
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
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

// HifziyaWaradaSadera.java
@Entity
@Table(name = "hifziya_warada_sadera")
@Data
@EqualsAndHashCode(callSuper = false)

@NoArgsConstructor
@AllArgsConstructor
public class HifziyaWaradaSadera extends Auditable {
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
    private HifziyaWaradaSaderaDirection direction;

    @ManyToOne
    @JoinColumn(name = "management_id")
    private Management management;

    // In HifziyaWaradaSadera.java
    @OneToMany(mappedBy = "hifziyaWaradaSadera", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER) // ✅
    @JsonIgnoreProperties({ "hifziyaWaradaSadera", "hibernateLazyInitializer" }) // ✅
    private List<FileEntity> files = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "cabinet_file_id")
    private CabinetFile cabinetFile;
}
