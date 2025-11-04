package com.MCIT.ArchiveManagementSystem.models.ArchiveManagement;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "export_doc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExportDoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    private String bookNumber; 
    private String parcelNumber; 
    private String sender;
    private LocalDate senderDate;
    private String recipient;
    private LocalDate dateSubmittedToPost; 
    private LocalDate archiveReceivedDate;   
    private String parcelType;    
    private String remarks;              
}
