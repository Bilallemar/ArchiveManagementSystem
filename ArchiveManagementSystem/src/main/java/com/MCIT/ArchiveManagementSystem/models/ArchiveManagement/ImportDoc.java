package com.MCIT.ArchiveManagementSystem.models.ArchiveManagement;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "import_doc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportDoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    private String bookNumber; 
    private String parcelNumber; 
    private String sender;
    private LocalDate senderDate;
    private String recipient;
    private LocalDate recipientDate;
    private String parcelType;         
    private LocalDate archiveReceivedDate;     
    private String remarks;              
}
