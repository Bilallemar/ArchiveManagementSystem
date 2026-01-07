package com.MCIT.ArchiveManagementSystem.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doc_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, unique = true)
    private String name; // e.g., "مکتوب", "حکم", "فرمان"
    
    private String description; // Optional description
    
    @Column(name = "is_active")
    private Boolean isActive = true; // To enable/disable doc types
}