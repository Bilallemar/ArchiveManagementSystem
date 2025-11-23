package com.MCIT.ArchiveManagementSystem.services;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.AuditLog;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;

public interface AuditLogService {
    // void logNoteCreation(String username, Note note);

    // void logNoteUpdate(String username, Note note);

void logCreation(String username, MakzanReceipt makzanReceipt);

    void logUpdate(String username);
    void logDeletion(String username, Long recordId);

    List<AuditLog> getAllAuditLogs();

    List<AuditLog> getAuditLogsForId(Long id);
}
