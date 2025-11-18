package com.MCIT.ArchiveManagementSystem.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Type {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
}
