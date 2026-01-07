package com.MCIT.ArchiveManagementSystem.services;

import com.MCIT.ArchiveManagementSystem.models.DocType;
import com.MCIT.ArchiveManagementSystem.repositories.DocTypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DocTypeService {
    
    private final DocTypeRepository docTypeRepository;
    
    public DocTypeService(DocTypeRepository docTypeRepository) {
        this.docTypeRepository = docTypeRepository;
    }
    
    public List<DocType> getAllDocTypes() {
        return docTypeRepository.findAll();
    }
    
    public List<DocType> getActiveDocTypes() {
        return docTypeRepository.findByIsActiveTrue();
    }
    
    public DocType getDocTypeById(Integer id) {
        return docTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DocType not found with id: " + id));
    }
    
    public DocType createDocType(DocType docType) {
        // Set default active status if not provided
        if (docType.getIsActive() == null) {
            docType.setIsActive(true);
        }
        return docTypeRepository.save(docType);
    }
    
    public DocType updateDocType(Integer id, DocType docTypeDetails) {
        DocType existing = docTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DocType not found with id: " + id));
        
        existing.setName(docTypeDetails.getName());
        existing.setDescription(docTypeDetails.getDescription());
        existing.setIsActive(docTypeDetails.getIsActive());
        
        return docTypeRepository.save(existing);
    }
    
    public void deleteDocType(Integer id) {
        DocType existing = docTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DocType not found with id: " + id));
        
        docTypeRepository.delete(existing);
    }
    
    // Soft delete - just mark as inactive
    public DocType toggleActive(Integer id) {
        DocType existing = docTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DocType not found with id: " + id));
        
        existing.setIsActive(!existing.getIsActive());
        return docTypeRepository.save(existing);
    }
}