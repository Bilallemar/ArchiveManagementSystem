package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.Org;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;

public interface HifziyaWaradaSaderaRepository extends JpaRepository<HifziyaWaradaSadera, Integer> {

        List<HifziyaWaradaSadera> findByOrg(Org org);
    Long countByOrg(Org org);
} 