package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.FileOffice;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.FileOfficeService;

@RestController
@RequestMapping("/api/fileOffices")
public class FileOfficeController {
  private final FileOfficeService fileOfficeService;  
   
public FileOfficeController( FileOfficeService fileOfficeService) {
    this.fileOfficeService = fileOfficeService;

}


@GetMapping
public List<FileOffice> getAllFileOffices() {
    return fileOfficeService.getAllFileOffices();
}


        @GetMapping("/{id}")
    public ResponseEntity<FileOffice> getFileOfficeById(@PathVariable Long id) {
        return fileOfficeService.getFileOfficeById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }
@PostMapping
public FileOffice createFileOffice(@RequestBody FileOffice fileOffice) {
    return fileOfficeService.createFileOffice(fileOffice);
}
@PutMapping("/{id}")
public ResponseEntity<FileOffice> updateFileOffice(@PathVariable Long id,@RequestBody FileOffice fileOfficeDetails) {
    FileOffice updatedDoc = fileOfficeService.updateFileOffice(id,fileOfficeDetails);
    return ResponseEntity.ok(updatedDoc);
}
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteFileOffice(Long id) {
      try {
            fileOfficeService.deleteFileOffice(id);
            return ResponseEntity.ok().body("FileOffice with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("FileOffice with ID " + id + " not found.");
        }


}

}
 

