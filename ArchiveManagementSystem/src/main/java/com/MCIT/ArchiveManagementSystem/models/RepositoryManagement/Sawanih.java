package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;

import com.MCIT.ArchiveManagementSystem.models.Org;

import jakarta.persistence.*;
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
    private String qaidWarida;
    private String incommingDate;
    private String outgoingDate;

    @ManyToOne
    @JoinColumn(name = "org")
    private Org org;

    private String description;
    private Integer pageQuantity;
}

