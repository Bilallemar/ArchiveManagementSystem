
package com.MCIT.ArchiveManagementSystem.controller.ArchiveManagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.dtos.ArchiveSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.ArchiveManagement.ArchiveService;

@RestController
@RequestMapping("/api/archives")
public class ArchiveController {

    private final ArchiveService archiveService;
    @Autowired
    private ManagementSecurityService managementSecurity;
    private static final Long ARCHIVE_MANAGEMENT_ID = 1L;

    public ArchiveController(ArchiveService archiveService) {
        this.archiveService = archiveService;
    }

    @GetMapping
    public ResponseEntity<Page<ArchiveSummaryDTO>> getAllArchives(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String direction,
            @RequestParam(defaultValue = "docNo") String field,
            @RequestParam(defaultValue = "") String term) {

        managementSecurity.validateManagementAccess(ARCHIVE_MANAGEMENT_ID);

        // Get management the same way your existing getAll did —
        // by filtering in the repository using ARCHIVE_MANAGEMENT_ID
        Management management = new Management();
        management.setManagementId(ARCHIVE_MANAGEMENT_ID);

        Page<ArchiveSummaryDTO> result = archiveService.getArchives(management, direction, field, term, page, size);

        return ResponseEntity.ok(result);
    }

    // Detail endpoint stays the same — returns full Archive entity
    @GetMapping("/{id}")
    public ResponseEntity<Archive> getArchiveById(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(ARCHIVE_MANAGEMENT_ID);
        return archiveService.getArchiveById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Archive createArchive(@RequestBody Archive exportDoc) {
        managementSecurity.validateManagementAccess(ARCHIVE_MANAGEMENT_ID);
        Management management = new Management();
        management.setManagementId(ARCHIVE_MANAGEMENT_ID);
        exportDoc.setManagement(management);
        return archiveService.createExportDoc(exportDoc);

        // ImportDoc savedDoc = importDocService.createImportDoc(importDoc);
        // return ResponseEntity.status(HttpStatus.CREATED).body(savedDoc);

    }

    @PutMapping("/{id}")
    public ResponseEntity<Archive> updateArchive(@PathVariable Integer id,
            @RequestBody Archive exportDocDetails) {
        managementSecurity.validateManagementAccess(ARCHIVE_MANAGEMENT_ID);
        Archive updatedDoc = archiveService.updateArchive(id, exportDocDetails);
        return ResponseEntity.ok(updatedDoc);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArchive(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(ARCHIVE_MANAGEMENT_ID);
        try {
            archiveService.deleteArchive(id);
            return ResponseEntity.ok().body("Archive with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Archive with ID " + id + " not found.");
        }
    }

}
