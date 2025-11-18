package com.MCIT.ArchiveManagementSystem.repositories;

import com.MCIT.ArchiveManagementSystem.models.Management;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface ManagementRepository extends JpaRepository<Management, Long> {
    Optional<Management> findByManagementName(String managementName);
    boolean existsByManagementName(String managementName);
}
