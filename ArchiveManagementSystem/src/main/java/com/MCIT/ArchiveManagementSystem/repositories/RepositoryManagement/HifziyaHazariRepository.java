package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.Org;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;

public interface HifziyaHazariRepository extends JpaRepository<HifziyaHazari, Integer> {

     List<HifziyaHazari> findByOrg(Org org);
    Long countByOrg(Org org);
} 
