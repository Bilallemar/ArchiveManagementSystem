package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.SawanihRepository;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.SawanihService;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sawanih")
public class SawanihController {

    private final SawanihService sawanihService;
    private final FileService fileService;

    @Autowired
    private ManagementSecurityService managementSecurity;

    private static final Long HIFZIYA_MANAGEMENT_ID = 2L; // Hifziya management ID

    public SawanihController(SawanihService sawanihService, FileService fileService) {
        this.sawanihService = sawanihService;
        this.fileService = fileService;
    }

    @GetMapping
    public List<Sawanih> getAllSawanih() {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        return sawanihService.getAllSawanihs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sawanih> getSawanihById(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        return sawanihService.getSawanihById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public Sawanih createSawanih(
            @RequestPart("sawanih") String sawanihJson,
            @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL
    ) throws IOException {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Sawanih sawanih = mapper.readValue(sawanihJson, Sawanih.class);

        return sawanihService.createSawanih(sawanih, fileURL);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSawanih(
            @PathVariable Integer id,
            @RequestPart("sawanih") String sawanihJson,
            @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL
    ) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            Sawanih sawanih = mapper.readValue(sawanihJson, Sawanih.class);

            Sawanih updatedSawanih = sawanihService.updateSawanih(id, sawanih, fileURL);

            return ResponseEntity.ok(updatedSawanih);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("د تازه کولو کې ستونزه: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSawanih(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        sawanihService.deleteSawanih(id);
        return ResponseEntity.ok("سوانح په بریالیتوب سره حذف شو");
    }

    /**
     * Download/Preview endpoint with clear Pashto error messages
     */
    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<?> download(@PathVariable String filename) {
        try {
            managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

            Resource resource = fileService.loadFileAsResource(filename);

            // Detect content type
            String contentType = "application/octet-stream";
            try {
                Path filePath = resource.getFile().toPath();
                String detectedType = Files.probeContentType(filePath);
                if (detectedType != null) {
                    contentType = detectedType;
                }
            } catch (IOException e) {
                // Fallback: guess from extension
                String fileName = resource.getFilename();
                if (fileName != null) {
                    if (fileName.endsWith(".pdf")) {
                        contentType = "application/pdf";
                    } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                        contentType = "image/jpeg";
                    } else if (fileName.endsWith(".png")) {
                        contentType = "image/png";
                    } else if (fileName.endsWith(".gif")) {
                        contentType = "image/gif";
                    } else if (fileName.endsWith(".webp")) {
                        contentType = "image/webp";
                    } else if (fileName.endsWith(".svg")) {
                        contentType = "image/svg+xml";
                    } else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
                        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
                        contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    }
                }
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (RuntimeException e) {
            // Check if it's a file not found error
            String errorMessage = e.getMessage();

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            if (errorMessage != null && errorMessage.contains("فایل په سرور کې نشته")) {
                // File not found - return 404 with clear Pashto message
                errorResponse.put("message", errorMessage);
                errorResponse.put("error", "FILE_NOT_FOUND");
                errorResponse.put("filename", filename);

                System.err.println("❌ فایل ونه موندل شو: " + filename);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);

            } else {
                // Other errors - return 500
                errorResponse.put("message", "د فایل د لوډ کولو کې ستونزه: " + errorMessage);
                errorResponse.put("error", "INTERNAL_ERROR");

                System.err.println("❌ د فایل لوډ کولو کې ستونزه '" + filename + "': " + errorMessage);
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }
        } catch (Exception e) {
            // Unexpected errors
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "نامعلومه ستونزه: " + e.getMessage());
            errorResponse.put("error", "UNKNOWN_ERROR");

            System.err.println("❌ نامعلومه ستونزه '" + filename + "': " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}