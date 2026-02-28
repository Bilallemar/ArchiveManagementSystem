package com.MCIT.ArchiveManagementSystem.services.ArchiveManagement;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive;
import com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement.ArchiveRepository;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

@Service
public class ArchiveService {
    private static final String TABLE_NAME = "archive";

    @Autowired
    private final ArchiveRepository archiveRepository;
    private final AuditLogHelper auditLogHelper;
    
    public ArchiveService(ArchiveRepository archiveRepository, AuditLogHelper auditLogHelper) {
        this.archiveRepository = archiveRepository;
        this.auditLogHelper = auditLogHelper;
    }

    public List<Archive> getAllArchives() {
        return archiveRepository.findAll();
    }

    public Optional<Archive> getArchiveById(Integer id) {
        return archiveRepository.findById(id);
    }

    public Archive createExportDoc(Archive archive) {
        // Validate that both sender and receiver are provided
        if (archive.getSenderOrg() == null || archive.getSenderOrg().getId() == null) {
            throw new RuntimeException("Sender organization is required");
        }
        if (archive.getReceiverOrg() == null || archive.getReceiverOrg().getId() == null) {
            throw new RuntimeException("Receiver organization is required");
        }
        
        // Save FIRST to generate the ID
        Archive savedArchive = archiveRepository.save(archive);
        
        // THEN log with the generated ID
        auditLogHelper.logCreate(TABLE_NAME, savedArchive.getId().longValue(), 
            savedArchive.getDescription());
        
        return savedArchive;
    }

    public Archive updateArchive(Integer id, Archive archiveDetails) {
        Archive existingDoc = archiveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Archive not found with id: " + id));

        // Update all fields - REMOVED externalOrg reference
        existingDoc.setDocNo(archiveDetails.getDocNo());
        existingDoc.setSendDate(archiveDetails.getSendDate());
        existingDoc.setDepartmentDate(archiveDetails.getDepartmentDate());
        existingDoc.setSenderOrg(archiveDetails.getSenderOrg());
        existingDoc.setReceiverOrg(archiveDetails.getReceiverOrg());
        existingDoc.setDocType(archiveDetails.getDocType());
        existingDoc.setDescription(archiveDetails.getDescription());
        existingDoc.setDirection(archiveDetails.getDirection());
        
        auditLogHelper.logUpdate(TABLE_NAME, existingDoc.getId().longValue(), existingDoc.getDescription());
        return archiveRepository.save(existingDoc);
    }

    public void deleteArchive(Integer id) {
        Archive archive = archiveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Archive not found with id: " + id));
        auditLogHelper.logDelete(TABLE_NAME, id.longValue(), archive.getDescription());
        archiveRepository.delete(archive);
    }
}