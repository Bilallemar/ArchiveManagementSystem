package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.HifziyaWaradaSaderaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;


import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/hifziya-warada-sadera")
public class HifziyaWaradaSaderaController {
private final HifziyaWaradaSaderaService hifziyaWaradaSaderaService;

    public HifziyaWaradaSaderaController( HifziyaWaradaSaderaService hifziyaWaradaSaderaService  ) {
        this.hifziyaWaradaSaderaService = hifziyaWaradaSaderaService;
    }
    

@GetMapping
public List<HifziyaWaradaSadera>getAllHifziyaWaradaSadera() {
    return hifziyaWaradaSaderaService.getAllHifziyaWaradaSadera();

}
@GetMapping("/{id}")
public ResponseEntity<HifziyaWaradaSadera>getHifziyaWaradaSaderaById(@PathVariable Integer id) {
    return hifziyaWaradaSaderaService.getHifziyaWaradaSaderaById(id)
    .map(ResponseEntity::ok)
    .orElse(ResponseEntity.notFound().build());

}

@PostMapping
public HifziyaWaradaSadera createHifziyaWaradaSadera(
        @RequestBody String hifziyaWaradaSadera
       
) throws IOException {
    
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    HifziyaWaradaSadera recivedrHifziyaWaradaSadera = mapper.readValue(hifziyaWaradaSadera, HifziyaWaradaSadera.class);

    return hifziyaWaradaSaderaService.createHifziyaWaradaSadera(recivedrHifziyaWaradaSadera);
}



@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<HifziyaWaradaSadera> updateReceipt(
        @PathVariable Integer id,
        @RequestBody String registrationJson    )         // JSON string د Receipts object لپاره
       {

    try {
        // JSON string parse کوو
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        HifziyaWaradaSadera recivedHifziyaWaradaSadera = mapper.readValue(registrationJson, HifziyaWaradaSadera.class);

        // service ته پاس کوو
        HifziyaWaradaSadera updatedHifziyaWaradaSadera = hifziyaWaradaSaderaService.updateHifziyaWaradaSadera(id, recivedHifziyaWaradaSadera);

        return ResponseEntity.ok(updatedHifziyaWaradaSadera);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteHifziyaWaradaSadera(@PathVariable Integer id) {
    try {
            // Optional: Add file deletion logic here if you want to delete associated files
            hifziyaWaradaSaderaService.deleteHifziyaWaradaSadera(id);
            return ResponseEntity.ok().body("HifziyaWaradaSadera with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("HifziyaWaradaSadera with ID " + id + " not found.");
        }
}
}
