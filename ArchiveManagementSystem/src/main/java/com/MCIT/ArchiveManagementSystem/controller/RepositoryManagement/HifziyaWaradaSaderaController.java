package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.HifziyaWaradaSaderaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;


import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/hifziya-warada-sadera")
public class HifziyaWaradaSaderaController {
private final HifziyaWaradaSaderaService hifziyaWaradaSaderaService;
private final FileService fileService;
    @Autowired
    private ManagementSecurityService managementSecurity;
        private static final Long HIFZIYA_MANAGEMENT_ID = 2L; // Hifziya management ID

    public HifziyaWaradaSaderaController( HifziyaWaradaSaderaService hifziyaWaradaSaderaService, FileService fileService) {
        this.hifziyaWaradaSaderaService = hifziyaWaradaSaderaService;
        this.fileService = fileService;
    }
    

@GetMapping
public List<HifziyaWaradaSadera>getAllHifziyaWaradaSadera() {
            managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

    return hifziyaWaradaSaderaService.getAllHifziyaWaradaSadera();

}
@GetMapping("/{id}")
public ResponseEntity<HifziyaWaradaSadera>getHifziyaWaradaSaderaById(@PathVariable Integer id) {
            managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

    return hifziyaWaradaSaderaService.getHifziyaWaradaSaderaById(id)
    .map(ResponseEntity::ok)
    .orElse(ResponseEntity.notFound().build());

}

@PostMapping(consumes = {"multipart/form-data"})
public HifziyaWaradaSadera createHifziyaWaradaSadera(
        @RequestPart("hifziyaWaradaSadera") String hifziyaWaradaSadera,
    @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL
       
) throws IOException {
            managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

    
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    HifziyaWaradaSadera recivedrHifziyaWaradaSadera = mapper.readValue(hifziyaWaradaSadera, HifziyaWaradaSadera.class);

    return hifziyaWaradaSaderaService.createHifziyaWaradaSadera(recivedrHifziyaWaradaSadera, fileURL);
}


@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<HifziyaWaradaSadera> updateHifziyaWaradaSadera(
        @PathVariable Integer id,
        @RequestPart("hifziyaWaradaSadera") String registrationJson,
         @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL    )         // JSON string د Receipts object لپاره
       {
                managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);


    try {
        // JSON string parse کوو
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        HifziyaWaradaSadera recivedHifziyaWaradaSadera = mapper.readValue(registrationJson, HifziyaWaradaSadera.class);

        // service ته پاس کوو
        HifziyaWaradaSadera updatedHifziyaWaradaSadera = hifziyaWaradaSaderaService.updateHifziyaWaradaSadera(id, recivedHifziyaWaradaSadera, fileURL);

        return ResponseEntity.ok(updatedHifziyaWaradaSadera);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteHifziyaWaradaSadera(@PathVariable Integer id) {
            managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

    try {
            // Optional: Add file deletion logic here if you want to delete associated files
            hifziyaWaradaSaderaService.deleteHifziyaWaradaSadera(id);
            return ResponseEntity.ok().body("HifziyaWaradaSadera with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("HifziyaWaradaSadera with ID " + id + " not found.");
        }
}


  @GetMapping("/download/{filename:.+}")
public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
            managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

    Resource resource = fileService.loadFileAsResource(filename);

    return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + resource.getFilename() + "\"")
            .body(resource);
}
}
