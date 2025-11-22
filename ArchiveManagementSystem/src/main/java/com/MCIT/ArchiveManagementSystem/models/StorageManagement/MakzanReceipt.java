package com.MCIT.ArchiveManagementSystem.models.StorageManagement;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Org;


@Entity
@Table(name = "makzan_receipt")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MakzanReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String no;
    private String docNo;

    @ManyToOne
    @JoinColumn(name = "org")
    private Org org;

    private String letterNo;
    private String letterDate;
    private String subjectType;
    private String description;

    @OneToMany(mappedBy = "makzanReceipt", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude          // ADD THIS
    @EqualsAndHashCode.Exclude // ADD THIS
    private List<FileEntity> files = new ArrayList<>();
}

