package com.MCIT.ArchiveManagementSystem.repositories;


import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.AppRole;
import com.MCIT.ArchiveManagementSystem.models.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(AppRole appRole);

}