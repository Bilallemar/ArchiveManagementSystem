package com.MCIT.ArchiveManagementSystem.services.ArchiveManagement;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.ImportDoc;
import com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement.ImportDocRepository;
@Service
public class ImportDocService {
    @Autowired
   private final ImportDocRepository importDocRepository;
    public ImportDocService(ImportDocRepository importDocRepository) {
        this.importDocRepository = importDocRepository;
    }

public List<ImportDoc> getAllImportDocs() {
    return importDocRepository.findAll();


}

public Optional<ImportDoc> getImportDocById(Long id) {
  
    return importDocRepository.findById(id);
}

public ImportDoc createImportDoc(ImportDoc importDoc) {
    return importDocRepository.save(importDoc);
}

public ImportDoc updateImportDoc(Long id, ImportDoc importDocDetails) {
    ImportDoc existingDoc = importDocRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("ImportDoc not found with id: " + id));

    existingDoc.setBookNumber(importDocDetails.getBookNumber());
    existingDoc.setParcelNumber(importDocDetails.getParcelNumber());
    existingDoc.setSender(importDocDetails.getSender());
    existingDoc.setSenderDate(importDocDetails.getSenderDate());
    existingDoc.setRecipient(importDocDetails.getRecipient());
    existingDoc.setRecipientDate(importDocDetails.getRecipientDate());
    existingDoc.setParcelType(importDocDetails.getParcelType());
    existingDoc.setArchiveReceivedDate(importDocDetails.getArchiveReceivedDate());
    existingDoc.setRemarks(importDocDetails.getRemarks());

    return importDocRepository.save(existingDoc);
}

   public void deleteImportDoc(Long id) {
        ImportDoc importDoc = importDocRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ImportDoc not found with id: " + id));
        importDocRepository.delete(importDoc);
    }



}

