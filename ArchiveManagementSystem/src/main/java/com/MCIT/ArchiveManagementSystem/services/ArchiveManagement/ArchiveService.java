package com.MCIT.ArchiveManagementSystem.services.ArchiveManagement;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive;
import com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement.ArchiveRepository;
@Service
public class ArchiveService {
    @Autowired
   private final ArchiveRepository exportDocRepository;
    public ArchiveService(ArchiveRepository exportDocRepository) {
        this.exportDocRepository = exportDocRepository;
    }

public List<Archive> getAllArchives() {
    return exportDocRepository.findAll();


}

public Optional<Archive> getArchiveById(Integer id) {
  
    return exportDocRepository.findById(id);
}

public Archive createExportDoc(Archive exportDoc) {
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
    existingDoc.setIsIndraj(exportDocDetails.getIsIndraj());

    return exportDocRepository.save(existingDoc);
}

   public void deleteArchive(Integer id) {
        Archive exportDoc = exportDocRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExportDoc not found with id: " + id));
        exportDocRepository.delete(exportDoc);
        
    }



}

