package com.MCIT.ArchiveManagementSystem.controller;


import com.MCIT.ArchiveManagementSystem.models.ScannedDocument;
import com.MCIT.ArchiveManagementSystem.services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentUploadController {
    
    @Autowired
    private DocumentService documentService;
    
    @Value("${file.upload.dir:uploads/scanned-documents}")
    private String uploadDirectory;
    
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "documentType", required = false) String documentType,
            @RequestParam(value = "description", required = false) String description) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create upload directory
            File uploadDir = new File(uploadDirectory);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            
            // Save file
            Path filepath = Paths.get(uploadDirectory, uniqueFilename);
            Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);
            
            // Save to database
            ScannedDocument document = new ScannedDocument();
            document.setOriginalFilename(originalFilename);
            document.setStoredFilename(uniqueFilename);
            document.setFilePath(filepath.toString());
            document.setFileSize(file.getSize());
            document.setContentType(file.getContentType());
            document.setDocumentType(documentType);
            document.setDescription(description);
            document.setUploadedAt(LocalDateTime.now());
            
            ScannedDocument savedDocument = documentService.saveDocument(document);
            
            response.put("success", true);
            response.put("message", "Document uploaded successfully");
            response.put("documentId", savedDocument.getId());
            response.put("filename", uniqueFilename);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "Failed to upload: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/list")
    public ResponseEntity<List<ScannedDocument>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ScannedDocument> getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDocument(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        boolean deleted = documentService.deleteDocument(id);
        
        response.put("success", deleted);
        response.put("message", deleted ? "Deleted successfully" : "Not found");
        
        return deleted ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }
    
@GetMapping("/{id}/download")
public ResponseEntity<?> downloadDocument(@PathVariable Long id) {
    try {
        return documentService.downloadDocument(id);
    } catch (Exception e) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "د فایل په لاسرسي کې ستونزه: " + e.getMessage());
        return ResponseEntity.status(500).body(response);
    }
}
    
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return ".jpg";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
    
}