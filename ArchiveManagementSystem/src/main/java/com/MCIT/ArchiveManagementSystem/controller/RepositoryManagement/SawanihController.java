package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.SawanihRepository;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.SawanihService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/sawanih")
public class SawanihController {

    private final SawanihService sawanihService; 
    private final Path fileStorageLocation;
        @Autowired
    private ManagementSecurityService managementSecurity;
        private static final Long HIFZIYA_MANAGEMENT_ID = 2L; // Hifziya management ID


    public SawanihController(SawanihService sawanihService,
                              SawanihRepository sawanihRepository) {
        this.sawanihService = sawanihService;
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
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

    // ✅ FIXED: Changed fileURL to required = false
    @PostMapping
    public Sawanih createSawanih(
            @RequestPart("Sawanih") String sawanihJson,
            @RequestPart(value = "fileURL", required = false) MultipartFile fileURL) throws IOException {
                        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);


        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Sawanih sawanih = mapper.readValue(sawanihJson, Sawanih.class);

        return sawanihService.createSawanih(sawanih, fileURL);
    }

    // ✅ FIXED: Renamed method from updateReceipt to updateSawanih
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Sawanih> updateSawanih(
            @PathVariable Integer id,
            @RequestPart("Sawanih") String sawanihJson,
            @RequestPart(value = "fileURL", required = false) MultipartFile fileURL) {
                        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);


        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            Sawanih sawanih = mapper.readValue(sawanihJson, Sawanih.class);

            // Set the ID to ensure update, not create
            sawanih.setId(id);

            Sawanih updatedSawanih = sawanihService.updateSawanih(id, sawanih, fileURL);

            return ResponseEntity.ok(updatedSawanih);

        } catch (Exception e) {
            e.printStackTrace(); // ✅ Added for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSawanih(@PathVariable Integer id) {
                managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        try {
            sawanihService.deleteSawanih(id);
            return ResponseEntity.ok().body("Sawanih with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Sawanih with ID " + id + " not found.");
        }
    }
}