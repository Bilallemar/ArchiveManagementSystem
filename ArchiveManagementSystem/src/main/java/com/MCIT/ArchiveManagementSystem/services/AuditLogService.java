package com.MCIT.ArchiveManagementSystem.services;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.AuditLog;

public interface AuditLogService {
    // void logNoteCreation(String username, Note note);

    // void logNoteUpdate(String username, Note note);

        void logNoteCreation(String username);

    void logNoteUpdate(String username);
    void logNoteDeletion(String username, Long noteId);

    List<AuditLog> getAllAuditLogs();

    List<AuditLog> getAuditLogsForNoteId(Long id);
}
