package com.MCIT.ArchiveManagementSystem.models;




import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
@Column(columnDefinition = "TEXT")
    private String content;

    private String ownerUsername;
}
