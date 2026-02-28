package com.MCIT.ArchiveManagementSystem.controller.StorageManagementControllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakhzanWaradaSadera;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.StorageManagementService.MakhzanWaradaSaderaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@RestController
@RequestMapping("/api/makhzan-warada-sadera")
public class MakhzanWaradaSaderaController {

    private final MakhzanWaradaSaderaService service;
    private final FileService fileService;

    @Autowired
    private ManagementSecurityService managementSecurity;

    private static final Long MAKHZAN_MANAGEMENT_ID = 3L;

    public MakhzanWaradaSaderaController(
            MakhzanWaradaSaderaService service,
            FileService fileService) {

        this.service = service;
        this.fileService = fileService;
    }

    @GetMapping
    public List<MakhzanWaradaSadera> getAll() {
        managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MakhzanWaradaSadera> getById(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MakhzanWaradaSadera create(
            @RequestPart("makhzanWaradaSadera") String json,
            @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL)
            throws IOException {

        managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());

        MakhzanWaradaSadera entity = mapper.readValue(json, MakhzanWaradaSadera.class);

        return service.create(entity, fileURL);
    }

    // @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ResponseEntity<MakhzanWaradaSadera> update(
    // @PathVariable Integer id,
    // @RequestPart("makhzanWaradaSadera") String json,
    // @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL) {

    // managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

    // try {
    // ObjectMapper mapper = new ObjectMapper();
    // mapper.registerModule(new JavaTimeModule());

    // MakhzanWaradaSadera entity =
    // mapper.readValue(json, MakhzanWaradaSadera.class);

    // return ResponseEntity.ok(service.update(id, entity, fileURL));
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    // }
    // }
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MakhzanWaradaSadera> updateMakhzanWaradaSadera(
            @PathVariable Integer id,
            @RequestPart("makhzanWaradaSadera") String registrationJson,
            @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL) // JSON string د Receipts object
                                                                                       // لپاره
    {
        managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        try {
            // JSON string parse کوو
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            MakhzanWaradaSadera recivedMakhzanWaradaSadera = mapper.readValue(registrationJson,
                    MakhzanWaradaSadera.class);

            // service ته پاس کوو
            MakhzanWaradaSadera updatedMakhzanWaradaSadera = service.updateMakhzanWaradaSadera(id,
                    recivedMakhzanWaradaSadera, fileURL);

            return ResponseEntity.ok(updatedMakhzanWaradaSadera);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        service.delete(id);
        return ResponseEntity.ok("MakhzanWaradaSadera deleted successfully");
    }

    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<?> download(@PathVariable String filename) {
        try {
            managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

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
