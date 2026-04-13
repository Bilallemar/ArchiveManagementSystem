package com.MCIT.ArchiveManagementSystem.models.CabinetAddress;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cabinets")
@Data @NoArgsConstructor @AllArgsConstructor
public class Cabinet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;       // e.g. "Cabinet A"
    private String location;   // e.g. "Room 1"
    private String description;
}