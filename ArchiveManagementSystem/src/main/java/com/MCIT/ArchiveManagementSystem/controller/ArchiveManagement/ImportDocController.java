
package com.MCIT.ArchiveManagementSystem.controller.ArchiveManagement;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;

import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.ImportDoc;
import com.MCIT.ArchiveManagementSystem.services.ArchiveManagement.ImportDocService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/importDoc")
public class ImportDocController {

private final ImportDocService importDocService;
    public ImportDocController( ImportDocService importDocService) {
        this.importDocService = importDocService;
    }

    @GetMapping
 public  List<ImportDoc> gitAllImportDocs() {
        return  importDocService.getAllImportDocs(); 
        
    }

        @GetMapping("/{id}")
    public ResponseEntity<ImportDoc> getImportDocById(@PathVariable Long id) {
        return importDocService.getImportDocById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());

    }

@PostMapping
    public ImportDoc createImportDoc( @RequestBody ImportDoc importDoc) {
        return importDocService.createImportDoc(importDoc);

    // ImportDoc savedDoc = importDocService.createImportDoc(importDoc);
    // return ResponseEntity.status(HttpStatus.CREATED).body(savedDoc);
        
    }

   @PutMapping("/{id}")
    public ResponseEntity<ImportDoc> updateImportDoc(@PathVariable Long id,
                                                     @RequestBody ImportDoc importDocDetails) {
        ImportDoc updatedDoc = importDocService.updateImportDoc(id, importDocDetails);
        return ResponseEntity.ok(updatedDoc);
    }

      @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImportDoc(@PathVariable Long id) {
              try {
            // Optional: Add file deletion logic here if you want to delete associated files
            importDocService.deleteImportDoc(id);
            return ResponseEntity.ok().body("ImportDoc with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("ImportDoc with ID " + id + " not found.");
        }
    }

        
    }



     