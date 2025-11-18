package com.MCIT.ArchiveManagementSystem.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sub_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private Type type;
}
