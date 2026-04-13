package com.MCIT.ArchiveManagementSystem.models.CabinetAddress;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "cabinet_shelves")
@Data @NoArgsConstructor @AllArgsConstructor
public class CabinetShelf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;       // e.g. "Shelf 1"

    @ManyToOne
    @JoinColumn(name = "floor_id")
    @JsonIgnoreProperties({"shelves", "hibernateLazyInitializer"})
    private CabinetFloor floor;
}
