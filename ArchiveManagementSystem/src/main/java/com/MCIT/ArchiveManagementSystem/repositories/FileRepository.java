package com.MCIT.ArchiveManagementSystem.repositories;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {
}
