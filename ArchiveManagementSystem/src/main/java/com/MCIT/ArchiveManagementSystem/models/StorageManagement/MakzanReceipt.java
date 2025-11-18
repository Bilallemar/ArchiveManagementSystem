package com.MCIT.ArchiveManagementSystem.models.StorageManagement;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String file;
    private String description;
}

