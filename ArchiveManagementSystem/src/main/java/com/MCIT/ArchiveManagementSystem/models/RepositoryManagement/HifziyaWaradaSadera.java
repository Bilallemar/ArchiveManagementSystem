package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.MCIT.ArchiveManagementSystem.models.Org;

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
    @JoinColumn(name = "org")
    private Org org;

    private String letterNumber;
    private String incommingDate;
    private String outgoingDate;
    private String summary;
    private String description;
    private String file;
    private Boolean isIndraj;
}

