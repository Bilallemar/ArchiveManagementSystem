package com.MCIT.ArchiveManagementSystem.repositories;


import com.MCIT.ArchiveManagementSystem.models.ScannedDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScannedDocumentRepository extends JpaRepository<ScannedDocument, Long> {
}