package com.MCIT.ArchiveManagementSystem.repositories;

import com.MCIT.ArchiveManagementSystem.models.DocType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocTypeRepository extends JpaRepository<DocType, Integer> {
    
    // Find all active doc types
    List<DocType> findByIsActiveTrue();
    
    // Find by name
    DocType findByName(String name);
}