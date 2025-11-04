package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.EmpoymentOffice;

@Repository
public interface EmpoymentOfficeRepository extends JpaRepository<EmpoymentOffice, Long> {
}