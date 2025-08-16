package com.MCIT.ArchiveManagementSystem.services;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.AuditLog;
import com.MCIT.ArchiveManagementSystem.models.Note;

public interface AuditLogService {
    void logNoteCreation(String username, Note note);

    void logNoteUpdate(String username, Note note);

    void logNoteDeletion(String username, Long noteId);

    List<AuditLog> getAllAuditLogs();

    List<AuditLog> getAuditLogsForNoteId(Long id);
}
