package com.MCIT.ArchiveManagementSystem.models.ArchiveManagement;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.Org;


@Entity
@Table(name = "archive")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Archive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String docNo;
    private String incommingDate;
    private String outgoingDate;

    @ManyToOne
    @JoinColumn(name = "org")
    private Org org;
  @ManyToOne
    @JoinColumn(name = "management_id")
    private Management management;
    
    private String submitedDate;
    private String description;
    private String docType;
    private Integer year;
    private Boolean isIncoming;
}

