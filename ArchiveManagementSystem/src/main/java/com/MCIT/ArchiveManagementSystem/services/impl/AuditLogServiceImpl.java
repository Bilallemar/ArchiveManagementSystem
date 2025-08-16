package com.MCIT.ArchiveManagementSystem.services.impl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.AuditLog;
import com.MCIT.ArchiveManagementSystem.models.Note;
import com.MCIT.ArchiveManagementSystem.repositories.AuditLogRepository;
import com.MCIT.ArchiveManagementSystem.services.AuditLogService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    @Autowired
    AuditLogRepository auditLogRepository;

    @Override
    public void logNoteCreation(String username, Note note){
        AuditLog log = new AuditLog();
        log.setAction("CREATE");
        log.setUsername(username);
        log.setNoteId(note.getId());
        log.setNoteContent(note.getContent());
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    @Override
    public void logNoteUpdate(String username, Note note){
        AuditLog log = new AuditLog();
        log.setAction("UPDATE");
        log.setUsername(username);
        log.setNoteId(note.getId());
        log.setNoteContent(note.getContent());
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    @Override
    public void logNoteDeletion(String username, Long noteId){
        AuditLog log = new AuditLog();
        log.setAction("DELETE");
        log.setUsername(username);
        log.setNoteId(noteId);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    @Override
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    @Override
    public List<AuditLog> getAuditLogsForNoteId(Long id) {
        return auditLogRepository.findByNoteId(id);
    }
}
