package com.MCIT.ArchiveManagementSystem.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.models.AuditLog;
import com.MCIT.ArchiveManagementSystem.services.AuditLogService;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditLogController {
    @Autowired
    AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<AuditLog> getAuditLogs(){
        return auditLogService.getAllAuditLogs();
    }

    @GetMapping("/note/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<AuditLog> getNoteAuditLogs(@PathVariable Long id){
        return auditLogService.getAuditLogsForNoteId(id);
    }

}
