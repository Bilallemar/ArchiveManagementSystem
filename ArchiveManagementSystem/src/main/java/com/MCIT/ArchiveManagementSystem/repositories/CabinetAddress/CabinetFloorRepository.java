package com.MCIT.ArchiveManagementSystem.repositories.CabinetAddress;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.Cabinet;
import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetFloor;

public interface CabinetFloorRepository extends JpaRepository<CabinetFloor, Integer> {
  List<CabinetFloor> findByCabinet(Cabinet cabinet);
}
