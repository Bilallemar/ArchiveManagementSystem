package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.HifziyaHazariService;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/hifziya-hazari")
public class HifziyaHazariController {

    private final HifziyaHazariService hifziyaHazariService;
    private final FileService fileService;
    
    @Autowired
    private ManagementSecurityService managementSecurity;
    
    private static final Long HIFZIYA_MANAGEMENT_ID = 2L;

    public HifziyaHazariController(HifziyaHazariService hifziyaHazariService, FileService fileService) {
        this.hifziyaHazariService = hifziyaHazariService;
        this.fileService = fileService;
    }

    // ✅ UPDATED: Now accepts multiple files
    @PostMapping(consumes = {"multipart/form-data"})
    public HifziyaHazari createHifziyaHazari(
            @RequestPart("hifziyaHazari") String hifziyaHazari,
            @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL
    ) throws IOException {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        System.out.println("Received JSON: " + hifziyaHazari);

        if (fileURL != null && fileURL.length > 0) {
            System.out.println("Received " + fileURL.length + " files:");
            for (MultipartFile file : fileURL) {
                System.out.println("  - " + file.getOriginalFilename() + ", size=" + file.getSize());
            }
        } else {
            System.out.println("No files received");
        }

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        HifziyaHazari receivedHifziyaHazari = mapper.readValue(hifziyaHazari, HifziyaHazari.class);

        System.out.println("Parsed HifziyaHazari: " + receivedHifziyaHazari);

        return hifziyaHazariService.createHifziyaHazari(receivedHifziyaHazari, fileURL);
    }

    @GetMapping
    public List<HifziyaHazari> getAllHifziyaHazaris() {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        return hifziyaHazariService.getAllHifziyaHazaris();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HifziyaHazari> getHifziyaHazariById(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        return hifziyaHazariService.getHifziyaHazariById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHifziyaHazari(
            @PathVariable Integer id,
            @RequestPart("hifziyaHazari") String registrationJson,
            @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL
    ) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        try {
            System.out.println("🔄 UPDATE Request for ID: " + id);
            System.out.println("📄 JSON Data: " + registrationJson);
            
            if (fileURL != null && fileURL.length > 0) {
                System.out.println("📎 Files to upload: " + fileURL.length);
                for (MultipartFile file : fileURL) {
                    System.out.println("  - " + file.getOriginalFilename());
                }
            }
            
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            HifziyaHazari receivedHifziyaHazari = mapper.readValue(registrationJson, HifziyaHazari.class);

            HifziyaHazari updatedHifziyaHazari = hifziyaHazariService.updateHifziyaHazari(id, receivedHifziyaHazari, fileURL);

            System.out.println("✅ Update successful for ID: " + id);
            return ResponseEntity.ok(updatedHifziyaHazari);
            
        } catch (Exception e) {
            System.err.println("❌ Update failed for ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Update failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHifziyaHazari(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        hifziyaHazariService.deleteHifziyaHazari(id);
        return ResponseEntity.ok("HifziyaHazari with ID " + id + " has been deleted successfully.");
    }

    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        Resource resource = fileService.loadFileAsResource(filename);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}