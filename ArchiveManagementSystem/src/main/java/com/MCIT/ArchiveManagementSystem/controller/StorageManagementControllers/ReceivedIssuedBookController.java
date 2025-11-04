package com.MCIT.ArchiveManagementSystem.controller.StorageManagementControllers;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.ReceivedIssuedBook;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.ReceivedIssuedBookRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.StorageManagementService.ReceivedIssuedBookService;
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
@RequestMapping("/api/received-issued-books")
public class ReceivedIssuedBookController {

    private final ReceivedIssuedBookService receivedIssuedBookService;
    private final Path fileStorageLocation;
    private final FileService fileService;

    
    public ReceivedIssuedBookController( ReceivedIssuedBookService receivedIssuedBookService, FileService fileService,
                              ReceivedIssuedBookRepository receivedIssuedBookRepository) {
        this.receivedIssuedBookService = receivedIssuedBookService;
        this.fileService = fileService;
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    @GetMapping
    public List<ReceivedIssuedBook > getAllReceipts() {
        return receivedIssuedBookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReceivedIssuedBook> getReceiptById(@PathVariable Long id) {
        return receivedIssuedBookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Original create endpoint (kept for backward compatibility)
    @PostMapping
    public ReceivedIssuedBook createReceipt(@RequestPart("receivedIssuedBook") String receivedIssuedBook,@RequestPart(value = "fileURL", required = true) MultipartFile fileURL) throws IOException {


        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        ReceivedIssuedBook recivedReceipts = mapper.readValue(receivedIssuedBook, ReceivedIssuedBook.class);



        return receivedIssuedBookService.createBook(recivedReceipts, fileURL);
    }



@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<ReceivedIssuedBook> updateReceipt(
        @PathVariable Long id,
        @RequestPart("receivedIssuedBook") String receivedIssuedBook,
        @RequestPart(value = "fileURL", required = false) MultipartFile fileURL) {

    try {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        ReceivedIssuedBook recivedReceipts = mapper.readValue(receivedIssuedBook, ReceivedIssuedBook.class);

        ReceivedIssuedBook existingReceivedIssuedBook = receivedIssuedBookService.getBookById(id)
                                    .orElseThrow(() -> new RuntimeException("ReceivedIssuedBook not found"));

        if (fileURL != null && !fileURL.isEmpty()) {
            String newFilePath = fileService.savefile(fileURL, existingReceivedIssuedBook);

            FileEntity newFileEntity = new FileEntity();
            newFileEntity.setFilePath(newFilePath);
            newFileEntity.setFileName(fileURL.getOriginalFilename());
            newFileEntity.setFileType(fileURL.getContentType());
            newFileEntity.setReceivedIssuedBook(existingReceivedIssuedBook);

            List<FileEntity> attachments = existingReceivedIssuedBook.getAttachments();
            attachments.add(newFileEntity);

            recivedReceipts.setAttachments(attachments);
        } else {
            recivedReceipts.setAttachments(existingReceivedIssuedBook.getAttachments());
        }

        // اړین دی چې ID وساتل شي ترڅو اپډېټ وشي نه نو به نوی ریکارډ جوړ شي
        recivedReceipts.setId(id);

        ReceivedIssuedBook updatedReceivedIssuedBook = receivedIssuedBookService.updateBook(id, recivedReceipts,fileURL);

        return ResponseEntity.ok(updatedReceivedIssuedBook);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            // Optional: Add file deletion logic here if you want to delete associated files
            receivedIssuedBookService.deleteBook(id);
            return ResponseEntity.ok().body("ReceivedIssuedBook with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("ReceivedIssuedBook with ID " + id + " not found.");
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
public List<ReceivedIssuedBook> searchReceivedIssuedBooks(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String field) {
    return receivedIssuedBookService.searchByKeyword(field, keyword);
}



}