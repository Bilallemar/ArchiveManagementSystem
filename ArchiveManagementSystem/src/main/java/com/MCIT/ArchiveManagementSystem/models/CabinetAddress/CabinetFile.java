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
@Table(name = "cabinet_files")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CabinetFile {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  private String name; // e.g. "File 1"
  private String fileNumber; // e.g. "F-001"

  @ManyToOne
  @JoinColumn(name = "shelf_id")
  @JsonIgnoreProperties({"files", "hibernateLazyInitializer"}) 
  private CabinetShelf shelf;
}
