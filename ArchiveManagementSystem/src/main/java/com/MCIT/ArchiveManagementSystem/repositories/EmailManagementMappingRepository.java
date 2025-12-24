package com.MCIT.ArchiveManagementSystem.repositories;

import com.MCIT.ArchiveManagementSystem.models.EmailManagementMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailManagementMappingRepository extends JpaRepository<EmailManagementMapping, Long> {
    Optional<EmailManagementMapping> findByEmailPatternAndIsActive(String emailPattern, boolean isActive);
    List<EmailManagementMapping> findByIsActive(boolean isActive);
}