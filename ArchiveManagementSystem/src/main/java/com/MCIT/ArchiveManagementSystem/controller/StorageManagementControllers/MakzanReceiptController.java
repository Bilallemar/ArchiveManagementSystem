package com.MCIT.ArchiveManagementSystem.controller.StorageManagementControllers;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.StorageManagementService.MakzanReceiptService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.MCIT.ArchiveManagementSystem.services.AuditLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.security.core.Authentication;


import java.io.IOException;
import java.nio.file.Files;


import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/makzan-receipts")
public class MakzanReceiptController {

    private final MakzanReceiptService receiptsService;
    private final Path fileStorageLocation;
    private final AuditLogService auditLogService;
        @Autowired
    private ManagementSecurityService managementSecurity;
        private static final Long MAKHZAN_MANAGEMENT_ID = 3L; // Makhzan management ID

    // private final FileService fileService;

    
    public MakzanReceiptController(MakzanReceiptService receiptsService,  
                              MakzanReceiptRepository receiptsRepository,
                              AuditLogService auditLogService) {
        this.receiptsService = receiptsService;
        this.auditLogService = auditLogService;
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    @GetMapping
    public List<MakzanReceipt> getAllReceipts() {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        return receiptsService.getAllReceipts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MakzanReceipt> getReceiptById(@PathVariable Integer id) {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        return receiptsService.getReceiptById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }




@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public MakzanReceipt createReceipt(
        @RequestPart("receipts") String receipts,
    @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL
       
) throws IOException {
                    managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

    
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    MakzanReceipt recivedrMakzanReceipt = mapper.readValue(receipts, MakzanReceipt.class);

    return receiptsService.createReceipt(recivedrMakzanReceipt, fileURL);
}





@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<MakzanReceipt> updateReceipt(
        @PathVariable Integer id,
        @RequestPart("receipts") String receiptsJson,              // JSON string د Receipts object لپاره
        @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL) {
                    managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);


    try {
        // JSON string parse کوو
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        MakzanReceipt recivedReceipts = mapper.readValue(receiptsJson, MakzanReceipt.class);

        // service ته پاس کوو
        MakzanReceipt updatedReceipt = receiptsService.updateReceipt(id, recivedReceipts, fileURL);

        return ResponseEntity.ok(updatedReceipt);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReceipt(@PathVariable Integer id) {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        try {
            // Optional: Add file deletion logic here if you want to delete associated files
            receiptsService.deleteReceipt(id);
            return ResponseEntity.ok().body("Receipt with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Receipt with ID " + id + " not found.");
        }
    }

// @GetMapping("/download/{filename:.+}")
// public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
//     try {
//         Resource resource = fileService.loadFileAsResource(filename);
//         return ResponseEntity.ok()
//                 .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                 .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
//                 .body(resource);
//     } catch (RuntimeException e) {
//         return ResponseEntity.notFound().build();
//     }
// }

@GetMapping("/search")
public List<MakzanReceipt> searchReceipts(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String field) {
    return receiptsService.searchByKeyword(field, keyword);
}



}