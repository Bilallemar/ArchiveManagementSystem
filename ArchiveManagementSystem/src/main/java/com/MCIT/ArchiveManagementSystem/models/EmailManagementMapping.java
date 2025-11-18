package com.MCIT.ArchiveManagementSystem.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "email_management_mappings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailManagementMapping {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String emailPattern; // e.g., "finance@company.com" or "@finance.company.com"
    
    @ManyToOne
    @JoinColumn(name = "management_id")
    private Management management;
    
    private boolean isActive = true;
}