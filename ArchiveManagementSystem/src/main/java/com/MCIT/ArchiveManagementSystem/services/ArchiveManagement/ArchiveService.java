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
   private final ArchiveRepository exportDocRepository;
   private final AuditLogHelper auditLogHelper;
    public ArchiveService(ArchiveRepository exportDocRepository, AuditLogHelper auditLogHelper) {
        this.exportDocRepository = exportDocRepository;
        this.auditLogHelper = auditLogHelper;
    }

public List<Archive> getAllArchives() {
    return exportDocRepository.findAll();


}

public Optional<Archive> getArchiveById(Integer id) {
  
    return exportDocRepository.findById(id);
}

public Archive createExportDoc(Archive exportDoc) {
            auditLogHelper.logCreate(TABLE_NAME, exportDoc.getId().longValue(), 
            exportDoc.getDescription());
    return exportDocRepository.save(exportDoc);
}

public Archive updateArchive(Integer id, Archive exportDocDetails) {
    Archive existingDoc = exportDocRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("ExportDoc not found with id: " + id));

    existingDoc.setDocNo(exportDocDetails.getDocNo());
    existingDoc.setIncommingDate(exportDocDetails.getIncommingDate());
    existingDoc.setOutgoingDate(exportDocDetails.getOutgoingDate());
    existingDoc.setOrg(exportDocDetails.getOrg());
    existingDoc.setDocType(exportDocDetails.getDocType());
    existingDoc.setYear(exportDocDetails.getYear());
    existingDoc.setDescription(exportDocDetails.getDescription());
    existingDoc.setIsIncoming(exportDocDetails.getIsIncoming());
auditLogHelper.logUpdate(TABLE_NAME, existingDoc.getId().longValue(), existingDoc.getDescription());
    return exportDocRepository.save(existingDoc);
}

   public void deleteArchive(Integer id) {
        Archive exportDoc = exportDocRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExportDoc not found with id: " + id));
                auditLogHelper.logDelete(TABLE_NAME, id.longValue(), exportDoc.getDescription());
        exportDocRepository.delete(exportDoc);
        
    }



}

