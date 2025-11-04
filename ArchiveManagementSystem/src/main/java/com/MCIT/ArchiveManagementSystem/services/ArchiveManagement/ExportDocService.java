package com.MCIT.ArchiveManagementSystem.services.ArchiveManagement;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.ExportDoc;
import com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement.ExportDocRepository;
@Service
public class ExportDocService {
    @Autowired
   private final ExportDocRepository exportDocRepository;
    public ExportDocService(ExportDocRepository exportDocRepository) {
        this.exportDocRepository = exportDocRepository;
    }

public List<ExportDoc> getAllExportDocs() {
    return exportDocRepository.findAll();


}

public Optional<ExportDoc> getExportDocById(Long id) {
  
    return exportDocRepository.findById(id);
}

public ExportDoc createExportDoc(ExportDoc exportDoc) {
    return exportDocRepository.save(exportDoc);
}

public ExportDoc updateExportDoc(Long id, ExportDoc exportDocDetails) {
    ExportDoc existingDoc = exportDocRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("ExportDoc not found with id: " + id));

    existingDoc.setBookNumber(exportDocDetails.getBookNumber());
    existingDoc.setParcelNumber(exportDocDetails.getParcelNumber());
    existingDoc.setSender(exportDocDetails.getSender());
    existingDoc.setSenderDate(exportDocDetails.getSenderDate());
    existingDoc.setRecipient(exportDocDetails.getRecipient());
    existingDoc.setDateSubmittedToPost(exportDocDetails.getDateSubmittedToPost());
    existingDoc.setParcelType(exportDocDetails.getParcelType());
    existingDoc.setArchiveReceivedDate(exportDocDetails.getArchiveReceivedDate());
    existingDoc.setRemarks(exportDocDetails.getRemarks());

    return exportDocRepository.save(existingDoc);
}

   public void deleteExportDoc(Long id) {
        ExportDoc exportDoc = exportDocRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExportDoc not found with id: " + id));
        exportDocRepository.delete(exportDoc);
        
    }



}

