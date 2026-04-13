package com.MCIT.ArchiveManagementSystem.repositories.CabinetAddress;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetFloor;
import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetShelf;
public interface CabinetShelfRepository extends JpaRepository<CabinetShelf, Integer> {
    List<CabinetShelf> findByFloor(CabinetFloor floor);
}