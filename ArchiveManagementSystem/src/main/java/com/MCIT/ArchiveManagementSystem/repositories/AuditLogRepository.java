package com.MCIT.ArchiveManagementSystem.repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.AuditLog;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByNoteId(Long noteId);
}
