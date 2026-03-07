package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.dtos.HifziyaHazariDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.HifziyaHazariService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

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

    @PostMapping(consumes = { "multipart/form-data" })
    public HifziyaHazari createHifziyaHazari(
            @RequestPart("hifziyaHazari") String hifziyaHazari,
            @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL) throws IOException {

        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        // 1. Parse the string FIRST
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        HifziyaHazari receivedHifziyaHazari = mapper.readValue(hifziyaHazari, HifziyaHazari.class);

        // 2. THEN set management on the parsed object
        Management management = new Management();
        management.setManagementId(HIFZIYA_MANAGEMENT_ID);
        receivedHifziyaHazari.setManagement(management); // ← now it's HifziyaHazari, not String

        return hifziyaHazariService.createHifziyaHazari(receivedHifziyaHazari, fileURL);
    }

    @GetMapping
    public ResponseEntity<Page<HifziyaHazariDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "volume") String field,
            @RequestParam(defaultValue = "") String term,
            @RequestParam(required = false) Boolean isIndraj) {

        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        Page<HifziyaHazariDTO> result = hifziyaHazariService.getHifziyaHazaris(
                HIFZIYA_MANAGEMENT_ID, isIndraj, field, term, page, size);

        return ResponseEntity.ok(result);
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
            @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            HifziyaHazari receivedHifziyaHazari = mapper.readValue(registrationJson, HifziyaHazari.class);

            HifziyaHazari updatedHifziyaHazari = hifziyaHazariService.updateHifziyaHazari(id, receivedHifziyaHazari,
                    fileURL);

            return ResponseEntity.ok(updatedHifziyaHazari);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("د تازه کولو کې ستونزه: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHifziyaHazari(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        hifziyaHazariService.deleteHifziyaHazari(id);
        return ResponseEntity.ok("حاضري په بریالیتوب سره حذف شو");
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