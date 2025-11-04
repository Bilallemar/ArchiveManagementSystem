
package com.MCIT.ArchiveManagementSystem.controller.ArchiveManagement;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;



import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.ExportDoc;
import com.MCIT.ArchiveManagementSystem.services.ArchiveManagement.ExportDocService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/exportDoc")
public class ExportDocController  {

private final ExportDocService exportDocService;
    public ExportDocController( ExportDocService exportDocService) {
        this.exportDocService = exportDocService;
    }

    @GetMapping
 public  List<ExportDoc> gitAllExportDocs() {
        return  exportDocService.getAllExportDocs(); 
        
    }

        @GetMapping("/{id}")
    public ResponseEntity<ExportDoc> getExportDocById(@PathVariable Long id) {
        return exportDocService.getExportDocById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());

    }

@PostMapping
    public ExportDoc createExportDoc( @RequestBody ExportDoc exportDoc) {
        return exportDocService.createExportDoc(exportDoc);

    // ImportDoc savedDoc = importDocService.createImportDoc(importDoc);
    // return ResponseEntity.status(HttpStatus.CREATED).body(savedDoc);
        
    }

   @PutMapping("/{id}")
    public ResponseEntity<ExportDoc> updateExportDoc(@PathVariable Long id,
                                                     @RequestBody ExportDoc exportDocDetails) {
        ExportDoc updatedDoc = exportDocService.updateExportDoc(id,exportDocDetails);
        return ResponseEntity.ok(updatedDoc);
    }

      @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExportDoc(@PathVariable Long id) {
              try {
            exportDocService.deleteExportDoc(id);
            return ResponseEntity.ok().body("ExportDoc with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("ExportDoc with ID " + id + " not found.");
        }
    }

        
    }



     