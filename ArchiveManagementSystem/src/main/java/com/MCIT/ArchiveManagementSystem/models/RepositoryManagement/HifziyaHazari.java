package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.MCIT.ArchiveManagementSystem.models.Org;
import com.MCIT.ArchiveManagementSystem.models.Type;


@Entity
@Table(name = "hifziya_hazari")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HifziyaHazari {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "type")
    private Type type;

    private Integer year;

    @ManyToOne
    @JoinColumn(name = "org")
    private Org org;

    private String file;
    private String description;
    private Boolean isIndraj;
}
