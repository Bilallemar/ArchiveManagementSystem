
package com.MCIT.ArchiveManagementSystem.controller.ArchiveManagement;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;



import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.ArchiveManagement.ArchiveService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/archives")
public class ArchiveController  {

private final ArchiveService archiveService;
    @Autowired
    private ManagementSecurityService managementSecurity;
        private static final Long ARCHIVE_MANAGEMENT_ID = 1L;
    public ArchiveController( ArchiveService archiveService) {
        this.archiveService = archiveService;
    }

    @GetMapping
 public  List<Archive> getAllArchives() {
     managementSecurity.validateManagementAccess(ARCHIVE_MANAGEMENT_ID);
        return  archiveService.getAllArchives(); 
        
    }

        @GetMapping("/{id}")
    public ResponseEntity<Archive> getArchiveById(@PathVariable Integer id) {
         managementSecurity.validateManagementAccess(ARCHIVE_MANAGEMENT_ID);
        return archiveService.getArchiveById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());

    }

@PostMapping
    public Archive createArchive( @RequestBody Archive exportDoc) {
         managementSecurity.validateManagementAccess(ARCHIVE_MANAGEMENT_ID);
        return archiveService.createExportDoc(exportDoc);

    // ImportDoc savedDoc = importDocService.createImportDoc(importDoc);
    // return ResponseEntity.status(HttpStatus.CREATED).body(savedDoc);
        
    }

   @PutMapping("/{id}")
    public ResponseEntity<Archive> updateArchive(@PathVariable Integer id,
                                                     @RequestBody Archive exportDocDetails) {
                                                         managementSecurity.validateManagementAccess(ARCHIVE_MANAGEMENT_ID);
        Archive updatedDoc = archiveService.updateArchive(id,exportDocDetails);
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



     