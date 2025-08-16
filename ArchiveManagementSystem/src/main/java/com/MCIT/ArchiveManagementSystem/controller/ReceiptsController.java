package com.MCIT.ArchiveManagementSystem.controller;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Receipts;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.ReceiptsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import com.MCIT.ArchiveManagementSystem.repositories.ReceiptsRepository;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



import java.io.IOException;
import java.nio.file.Files;


import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptsController {

    private final ReceiptsService receiptsService;
    private final Path fileStorageLocation;
    private final FileService fileService;
    private final ReceiptsRepository receiptsRepository;

    
    public ReceiptsController(ReceiptsService receiptsService, FileService fileService,
                              ReceiptsRepository receiptsRepository) {
        this.receiptsService = receiptsService;
        this.fileService = fileService;
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        this.receiptsRepository = receiptsRepository;
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    @GetMapping
    public List<Receipts> getAllReceipts() {
        return receiptsService.getAllReceipts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receipts> getReceiptById(@PathVariable Long id) {
        return receiptsService.getReceiptById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Original create endpoint (kept for backward compatibility)
    @PostMapping
    public Receipts createReceipt(@RequestPart("receipts") String receipts,@RequestPart(value = "fileURL", required = true) MultipartFile fileURL) throws IOException {


        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Receipts recivedReceipts = mapper.readValue(receipts, Receipts.class);



        return receiptsService.createReceipt(recivedReceipts, fileURL);
    }



@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Receipts> updateReceipt(
        @PathVariable Long id,
        @RequestPart("receipts") String receipts,
        @RequestPart(value = "fileURL", required = false) MultipartFile fileURL) {

    try {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Receipts recivedReceipts = mapper.readValue(receipts, Receipts.class);

        Receipts existingReceipt = receiptsService.getReceiptById(id)
                                    .orElseThrow(() -> new RuntimeException("Receipt not found"));

        if (fileURL != null && !fileURL.isEmpty()) {
            String newFilePath = fileService.savefile(fileURL, existingReceipt);

            FileEntity newFileEntity = new FileEntity();
            newFileEntity.setFilePath(newFilePath);
            newFileEntity.setFileName(fileURL.getOriginalFilename());
            newFileEntity.setFileType(fileURL.getContentType());
            newFileEntity.setReceipt(existingReceipt);

            List<FileEntity> attachments = existingReceipt.getAttachments();
            attachments.add(newFileEntity);

            recivedReceipts.setAttachments(attachments);
        } else {
            recivedReceipts.setAttachments(existingReceipt.getAttachments());
        }

        // اړین دی چې ID وساتل شي ترڅو اپډېټ وشي نه نو به نوی ریکارډ جوړ شي
        recivedReceipts.setId(id);

        Receipts updatedReceipt = receiptsService.updateReceipt(id, recivedReceipts,fileURL);

        return ResponseEntity.ok(updatedReceipt);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReceipt(@PathVariable Long id) {
        try {
            // Optional: Add file deletion logic here if you want to delete associated files
            receiptsService.deleteReceipt(id);
            return ResponseEntity.ok().body("Receipt with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Receipt with ID " + id + " not found.");
        }
    }

@GetMapping("/download/{filename:.+}")
public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
    try {
        Resource resource = fileService.loadFileAsResource(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    } catch (RuntimeException e) {
        return ResponseEntity.notFound().build();
    }
}

  @GetMapping("/search")
public List<Receipts> searchReceipts(@RequestParam(required = false) String keyword) {
    return receiptsService.searchByKeyword(keyword);
}


}