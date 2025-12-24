package com.MCIT.ArchiveManagementSystem.repositories;

import com.MCIT.ArchiveManagementSystem.models.Org;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrgRepository extends JpaRepository<Org, Integer> {
}
