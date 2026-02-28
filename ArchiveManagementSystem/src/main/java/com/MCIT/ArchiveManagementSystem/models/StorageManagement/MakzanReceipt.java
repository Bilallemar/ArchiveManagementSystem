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
import com.MCIT.ArchiveManagementSystem.models.Management;
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

    private String docNo;
    private String department ;

    @ManyToOne
    @JoinColumn(name = "org")
    private Org org;
  @ManyToOne
    @JoinColumn(name = "management_id")
    private Management management;
    
    private String letterNo;
    private String letterDate;
    private String subjectType;
    private String description;

    @OneToMany(mappedBy = "makzanReceipt", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude          // ADD THIS
    @EqualsAndHashCode.Exclude // ADD THIS
    private List<FileEntity> files = new ArrayList<>();
}

