package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;
import java.time.LocalDate;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "file_office")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileOffice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    private String name ;
    private String fatherName;  
    private String repositoryEntryRecord;
    private String fileLetterNumber;  
    private LocalDate senderDate;
    private LocalDate recipientDate;
    private String remarks;        


}
