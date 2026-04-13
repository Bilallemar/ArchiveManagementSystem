package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

import com.MCIT.ArchiveManagementSystem.dtos.SawanihSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.SawanihService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

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
    public ResponseEntity<Page<SawanihSummaryDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "volume") String field,
            @RequestParam(defaultValue = "") String term,
            @RequestParam(required = false) Boolean isSawanih) {

        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        Page<SawanihSummaryDTO> result = sawanihService.getAllSawanihs(
                HIFZIYA_MANAGEMENT_ID, isSawanih, field, term, page, size);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sawanih> getSawanihById(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        return sawanihService.getSawanihById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public Sawanih createSawanih(
            @RequestPart("sawanih") String sawanihJson,
            @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL,
            @RequestPart(value = "scannerFiles", required = false) String scannerFilesJson) throws IOException {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Sawanih sawanih = mapper.readValue(sawanihJson, Sawanih.class);
        Management management = new Management();
        management.setManagementId(HIFZIYA_MANAGEMENT_ID);
        sawanih.setManagement(management);

            List<String> scannerFiles = new ArrayList<>();
        if (scannerFilesJson != null && !scannerFilesJson.isBlank()) {
            scannerFiles = mapper.readValue(scannerFilesJson,
                mapper.getTypeFactory().constructCollectionType(List.class, String.class));
        }
        return sawanihService.createSawanih(sawanih, fileURL, scannerFiles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSawanih(
            @PathVariable Integer id,
            @RequestPart("sawanih") String sawanihJson,
            @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL,
            @RequestPart(value = "scannerFiles", required = false) String scannerFilesJson) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            Sawanih sawanih = mapper.readValue(sawanihJson, Sawanih.class);



                List<String> scannerFiles = new ArrayList<>();
        if (scannerFilesJson != null && !scannerFilesJson.isBlank()) {
            scannerFiles = mapper.readValue(scannerFilesJson,
                mapper.getTypeFactory().constructCollectionType(List.class, String.class));
        }
            Sawanih updatedSawanih = sawanihService.updateSawanih(id, sawanih, fileURL, scannerFiles);

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