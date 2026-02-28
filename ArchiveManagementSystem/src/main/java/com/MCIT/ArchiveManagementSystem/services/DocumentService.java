package com.MCIT.ArchiveManagementSystem.services;


import com.MCIT.ArchiveManagementSystem.models.ScannedDocument;
import com.MCIT.ArchiveManagementSystem.repositories.ScannedDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    @Autowired
    private ScannedDocumentRepository documentRepository;

    // Upload directory from application.properties (or default)
    @Value("${file.upload.dir:uploads/scanned-documents}")
    private String uploadDir;

    public ScannedDocument saveDocument(ScannedDocument document) {
        return documentRepository.save(document);
    }

    public List<ScannedDocument> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Optional<ScannedDocument> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    public boolean deleteDocument(Long id) {
        Optional<ScannedDocument> opt = documentRepository.findById(id);
        if (opt.isEmpty()) return false;

        ScannedDocument doc = opt.get();
        try {
            Path filePath = Paths.get(doc.getFilePath());
            Files.deleteIfExists(filePath);
            System.out.println("Deleted file: " + filePath); // log success
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + doc.getFilePath() + " - " + e.getMessage());
            // Continue anyway - don't block DB delete
        }

        documentRepository.deleteById(id);
        return true;
    }

    public ResponseEntity<Resource> downloadDocument(Long id) {
        Optional<ScannedDocument> opt = documentRepository.findById(id);
        if (opt.isEmpty()) {
            System.out.println("Document not found for ID: " + id);
            return ResponseEntity.notFound().build(); // 404
        }

        ScannedDocument doc = opt.get();
        Path filePath = Paths.get(doc.getFilePath()).normalize(); // Prevent path traversal

        // Security: ensure file is inside uploadDir
        Path baseDir = Paths.get(uploadDir).normalize();
        if (!filePath.startsWith(baseDir)) {
            System.err.println("Invalid path attempt: " + filePath);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403
        }

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                System.out.println("File not found or not readable: " + filePath);
                return ResponseEntity.notFound().build(); // 404
            }

            String contentType = doc.getContentType() != null ? doc.getContentType() : "application/octet-stream";

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                       "inline; filename=\"" + doc.getOriginalFilename() + "\"")  // inline for preview
                .body(resource);

        } catch (Exception e) {
            System.err.println("Error serving file ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}