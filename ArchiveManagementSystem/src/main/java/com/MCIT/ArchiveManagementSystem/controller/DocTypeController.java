package com.MCIT.ArchiveManagementSystem.controller;

import com.MCIT.ArchiveManagementSystem.models.DocType;
import com.MCIT.ArchiveManagementSystem.services.DocTypeService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doc-type")
@CrossOrigin(origins = "*")
public class DocTypeController {
    
    private final DocTypeService docTypeService;
    
    public DocTypeController(DocTypeService docTypeService) {
        this.docTypeService = docTypeService;
    }
    
    @GetMapping
    public List<DocType> getAllDocTypes() {
        return docTypeService.getAllDocTypes();
    }
    
    @GetMapping("/active")
    public List<DocType> getActiveDocTypes() {
        return docTypeService.getActiveDocTypes();
    }
    
    @GetMapping("/{id}")
    public DocType getDocTypeById(@PathVariable Integer id) {
        return docTypeService.getDocTypeById(id);
    }
    
    @PostMapping
    public DocType createDocType(@RequestBody DocType docType) {
        return docTypeService.createDocType(docType);
    }
    
    @PutMapping("/{id}")
    public DocType updateDocType(@PathVariable Integer id, @RequestBody DocType docType) {
        return docTypeService.updateDocType(id, docType);
    }
    
    @DeleteMapping("/{id}")
    public void deleteDocType(@PathVariable Integer id) {
        docTypeService.deleteDocType(id);
    }
    
    @PutMapping("/{id}/toggle-active")
    public DocType toggleActive(@PathVariable Integer id) {
        return docTypeService.toggleActive(id);
    }
}