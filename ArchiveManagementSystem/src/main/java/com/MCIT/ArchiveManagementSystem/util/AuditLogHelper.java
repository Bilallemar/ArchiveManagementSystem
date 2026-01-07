package com.MCIT.ArchiveManagementSystem.util;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.MCIT.ArchiveManagementSystem.models.AuditLog;
import com.MCIT.ArchiveManagementSystem.repositories.AuditLogRepository;

@Component
public class AuditLogHelper {
    
    private static final Logger logger = LoggerFactory.getLogger(AuditLogHelper.class);
    
    private final AuditLogRepository auditLogRepository;
    
    public AuditLogHelper(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    
    /**
     * Get current authenticated username
     */
    public String getCurrentUsername() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                return auth.getName();
            }
        } catch (Exception e) {
            logger.warn("Could not get authenticated username: {}", e.getMessage());
        }
        return "system";
    }
    
    /**
     * Log audit action
     * @param action CREATE, UPDATE, DELETE
     * @param tableName Name of the table/entity
     * @param recordId ID of the record
     * @param recordContent Description or summary of the record
     */
    public void logAudit(String action, String tableName, Long recordId, String recordContent) {
        try {
            AuditLog log = new AuditLog();
            log.setAction(action);
            log.setUsername(getCurrentUsername());
            log.setTableName(tableName);
            log.setRecordId(recordId);
            log.setRecordContent(recordContent);
            log.setTimestamp(LocalDateTime.now());
            
            auditLogRepository.save(log);
            logger.info("✅ Audit log created: {} action on {} table, ID: {} by {}", 
                action, tableName, recordId, getCurrentUsername());
        } catch (Exception e) {
            logger.error("❌ Failed to log audit for {} action on {}: {}", 
                action, tableName, e.getMessage(), e);
        }
    }
    
    /**
     * Convenience method for CREATE action
     */
    public void logCreate(String tableName, Long recordId, String recordContent) {
        logAudit("CREATE", tableName, recordId, recordContent);
    }
    
    /**
     * Convenience method for UPDATE action
     */
    public void logUpdate(String tableName, Long recordId, String recordContent) {
        logAudit("UPDATE", tableName, recordId, recordContent);
    }
    
    /**
     * Convenience method for DELETE action
     */
    public void logDelete(String tableName, Long recordId, String recordContent) {
        logAudit("DELETE", tableName, recordId, recordContent);
    }
}