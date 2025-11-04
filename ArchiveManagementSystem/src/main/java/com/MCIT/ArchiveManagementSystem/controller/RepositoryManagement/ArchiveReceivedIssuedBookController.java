package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ArchiveReceivedIssuedBook;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.ArchiveReceivedIssuedBookRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.ArchiveReceivedIssuedBookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

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
@RequestMapping("/api/archive-received-issued-books")
public class ArchiveReceivedIssuedBookController {

    private final ArchiveReceivedIssuedBookService receivedIssuedBookRepositoryService; ;
    private final Path fileStorageLocation;
    private final FileService fileService;

    
    public ArchiveReceivedIssuedBookController( ArchiveReceivedIssuedBookService receivedIssuedBookRepositoryService,
                               FileService fileService,
                              ArchiveReceivedIssuedBookRepository receivedIssuedBookRepositoryRepository) {
        this.receivedIssuedBookRepositoryService = receivedIssuedBookRepositoryService;
        this.fileService = fileService;
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    @GetMapping
    public List<ArchiveReceivedIssuedBook > getAllArchiveReceivedIssuedBook() {
        return receivedIssuedBookRepositoryService.getAllArchiveReceivedIssuedBooks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArchiveReceivedIssuedBook> getArchiveReceivedIssuedBookById(@PathVariable Long id) {
        return receivedIssuedBookRepositoryService.getArchiveReceivedIssuedBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Original create endpoint (kept for backward compatibility)
    @PostMapping
    public ArchiveReceivedIssuedBook createArchiveReceivedIssuedBook(@RequestPart("archiveReceivedIssuedBook") String receivedIssuedBookRepository,@RequestPart(value = "fileURL", required = true) MultipartFile fileURL) throws IOException {


        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        ArchiveReceivedIssuedBook recivedReceivedIssuedBookRepository = mapper.readValue(receivedIssuedBookRepository, ArchiveReceivedIssuedBook.class);



        return receivedIssuedBookRepositoryService.createArchiveReceivedIssuedBook(recivedReceivedIssuedBookRepository, fileURL);
    }



@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<ArchiveReceivedIssuedBook> updateReceipt(
        @PathVariable Long id,
        @RequestPart("receivedIssuedBook") String receivedIssuedBookRepository,
        @RequestPart(value = "fileURL", required = false) MultipartFile fileURL) {

    try {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        ArchiveReceivedIssuedBook recivedReceivedIssuedBookRepository = mapper.readValue(receivedIssuedBookRepository, ArchiveReceivedIssuedBook.class);

        ArchiveReceivedIssuedBook existingReceivedIssuedBookRepository = receivedIssuedBookRepositoryService.getArchiveReceivedIssuedBookById(id)
                                    .orElseThrow(() -> new RuntimeException("ReceivedIssuedBookRepository not found"));

        if (fileURL != null && !fileURL.isEmpty()) {
            String newFilePath = fileService.savefile(fileURL, existingReceivedIssuedBookRepository);

            FileEntity newFileEntity = new FileEntity();
            newFileEntity.setFilePath(newFilePath);
            newFileEntity.setFileName(fileURL.getOriginalFilename());
            newFileEntity.setFileType(fileURL.getContentType());
            newFileEntity.setArchiveReceivedIssuedBook(existingReceivedIssuedBookRepository);

            List<FileEntity> attachments = existingReceivedIssuedBookRepository.getAttachments();
            attachments.add(newFileEntity);

            recivedReceivedIssuedBookRepository.setAttachments(attachments);
        } else {
            recivedReceivedIssuedBookRepository.setAttachments(existingReceivedIssuedBookRepository.getAttachments());
        }

        // اړین دی چې ID وساتل شي ترڅو اپډېټ وشي نه نو به نوی ریکارډ جوړ شي
        recivedReceivedIssuedBookRepository.setId(id);

        ArchiveReceivedIssuedBook updatedReceivedIssuedBookRepository = receivedIssuedBookRepositoryService.updateArchiveReceivedIssuedBook(id, recivedReceivedIssuedBookRepository,fileURL);

        return ResponseEntity.ok(updatedReceivedIssuedBookRepository);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArchiveReceivedIssuedBook(@PathVariable Long id) {
        try {
            // Optional: Add file deletion logic here if you want to delete associated files
            receivedIssuedBookRepositoryService.deleteArchiveReceivedIssuedBook(id);
            return ResponseEntity.ok().body("ReceivedIssuedBooKRepository with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("ReceivedIssuedBookRepository with ID " + id + " not found.");
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
public List<ArchiveReceivedIssuedBook> searchReceivedIssuedBookRepositories(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String field) {
    return receivedIssuedBookRepositoryService.searchByKeyword(field, keyword);
}

}