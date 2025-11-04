package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "empoyment_office")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpoymentOffice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    private String name ;
    private String fatherName;  
    private String numberOfPages;
    private LocalDate senderDate;
    private LocalDate recipientDate;
    private String remarks;        
    private String fileLetterNumber;  


        @OneToMany(mappedBy = "empoymentOffice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileEntity> attachments = new ArrayList<>();
}
