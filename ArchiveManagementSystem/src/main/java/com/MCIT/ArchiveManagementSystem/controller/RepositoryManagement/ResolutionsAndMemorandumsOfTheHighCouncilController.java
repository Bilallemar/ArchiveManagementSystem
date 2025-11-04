package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ResolutionsAndMemorandumsOfTheHighCouncil;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.ResolutionsAndMemorandumsOfTheHighCouncilService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;


import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/resolutionsAndMemorandumsOfTheHighCouncil")
public class ResolutionsAndMemorandumsOfTheHighCouncilController {
private final ResolutionsAndMemorandumsOfTheHighCouncilService resolutionsAndMemorandumsOfTheHighCouncilService; ;
    public ResolutionsAndMemorandumsOfTheHighCouncilController( FileService fileService, ResolutionsAndMemorandumsOfTheHighCouncilService resolutionsAndMemorandumsOfTheHighCouncilService) {
        this.resolutionsAndMemorandumsOfTheHighCouncilService = resolutionsAndMemorandumsOfTheHighCouncilService;
       
    }
    

@GetMapping
public List<ResolutionsAndMemorandumsOfTheHighCouncil>getAllRMHC() {
    return resolutionsAndMemorandumsOfTheHighCouncilService.getAllRMHC();

}
@GetMapping("/{id}")
public ResponseEntity<ResolutionsAndMemorandumsOfTheHighCouncil>getRMHCById(@PathVariable Long id) {
    return resolutionsAndMemorandumsOfTheHighCouncilService.getRMHCById(id)
    .map(ResponseEntity::ok)
    .orElse(ResponseEntity.notFound().build());

}

@PostMapping
public ResolutionsAndMemorandumsOfTheHighCouncil createRMHC(
        @RequestPart("resolutionsAndMemorandumsOfTheHighCouncil") String resolutionsAndMemorandumsOfTheHighCouncil,
        @RequestPart("fileURL") MultipartFile fileURL
) throws IOException {
    
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    ResolutionsAndMemorandumsOfTheHighCouncil recivedrResolutionsAndMemorandumsOfTheHighCouncil = mapper.readValue(resolutionsAndMemorandumsOfTheHighCouncil, ResolutionsAndMemorandumsOfTheHighCouncil.class);

    return resolutionsAndMemorandumsOfTheHighCouncilService.createRMHC(recivedrResolutionsAndMemorandumsOfTheHighCouncil, fileURL);
}



@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<ResolutionsAndMemorandumsOfTheHighCouncil> updateRMHC(
        @PathVariable Long id,
        @RequestPart("resolutionsAndMemorandumsOfTheHighCouncil") String RMHCjson,              // JSON string د Receipts object لپاره
        @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL) {

    try {
        // JSON string parse کوو
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        ResolutionsAndMemorandumsOfTheHighCouncil recivedrResolutionsAndMemorandumsOfTheHighCouncil = mapper.readValue(RMHCjson, ResolutionsAndMemorandumsOfTheHighCouncil.class);

        // service ته پاس کوو
        ResolutionsAndMemorandumsOfTheHighCouncil updatedRMHC = resolutionsAndMemorandumsOfTheHighCouncilService.updateRMHC(id, recivedrResolutionsAndMemorandumsOfTheHighCouncil, fileURL);

        return ResponseEntity.ok(updatedRMHC);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteRMHC(@PathVariable Long id) {
    try {
            // Optional: Add file deletion logic here if you want to delete associated files
            resolutionsAndMemorandumsOfTheHighCouncilService.deleteRMHC(id);
            return ResponseEntity.ok().body("resolutionsAndMemorandumsOfTheHighCouncil with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("resolutionsAndMemorandumsOfTheHighCouncil with ID " + id + " not found.");
        }
}
}
