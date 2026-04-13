package com.MCIT.ArchiveManagementSystem.repositories.CabinetAddress;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetFile;
import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetShelf;

public interface CabinetFileRepository extends JpaRepository<CabinetFile, Integer> {
    List<CabinetFile> findByShelf(CabinetShelf shelf);
}
