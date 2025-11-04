package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;

@Entity
@Table(name = "RMOTHC")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResolutionsAndMemorandumsOfTheHighCouncil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id; 
    private String bookNumber; 
    private String serialNumber; 
    private String sender;
    private LocalDate senderDate;
    private String subject;
    private String letterNumber; 
    private LocalDate yearOfApproval
;   private String remarks; 


    @OneToMany(mappedBy = "resolutionsAndMemorandumsOfTheHighCouncil", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileEntity> attachments = new ArrayList<>();
}
