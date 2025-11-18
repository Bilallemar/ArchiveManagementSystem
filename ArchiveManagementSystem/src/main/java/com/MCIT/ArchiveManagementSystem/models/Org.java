package com.MCIT.ArchiveManagementSystem.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "org")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Org {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}
