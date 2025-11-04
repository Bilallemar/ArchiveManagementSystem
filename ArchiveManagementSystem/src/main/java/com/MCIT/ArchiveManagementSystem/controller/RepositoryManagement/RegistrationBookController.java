package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.RegistrationBook;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.RegistrationBookService;
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
@RequestMapping("/api/registrationBook")
public class RegistrationBookController {
private final RegistrationBookService registrationBookService;

    public RegistrationBookController( RegistrationBookService registrationBookService ,FileService fileService) {
        this.registrationBookService = registrationBookService;
    }
    

@GetMapping
public List<RegistrationBook>getAllRegistrationBooks() {
    return registrationBookService.getAllRegistrationBooks();

}
@GetMapping("/{id}")
public ResponseEntity<RegistrationBook>getRegistrationBookById(@PathVariable Long id) {
    return registrationBookService.getRegistrationBookById(id)
    .map(ResponseEntity::ok)
    .orElse(ResponseEntity.notFound().build());

}

@PostMapping
public RegistrationBook createRegistrationBook(
        @RequestPart("registrationBook") String registrationBook,
        @RequestPart("fileURL") MultipartFile fileURL
) throws IOException {
    
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    RegistrationBook recivedrRegistrationBook = mapper.readValue(registrationBook, RegistrationBook.class);

    return registrationBookService.createRegistrationBook(recivedrRegistrationBook, fileURL);
}



@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<RegistrationBook> updateReceipt(
        @PathVariable Long id,
        @RequestPart("registrationBook") String registrationJson,              // JSON string د Receipts object لپاره
        @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL) {

    try {
        // JSON string parse کوو
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        RegistrationBook recivedRegistrationBook = mapper.readValue(registrationJson, RegistrationBook.class);

        // service ته پاس کوو
        RegistrationBook updatedRegistrationBook = registrationBookService.updateRegistrationBook(id, recivedRegistrationBook, fileURL);

        return ResponseEntity.ok(updatedRegistrationBook);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteRegistrationBook(@PathVariable Long id) {
    try {
            // Optional: Add file deletion logic here if you want to delete associated files
            registrationBookService.deleteRegistrationBook(id);
            return ResponseEntity.ok().body("RegistrationBook with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("RegistrationBook with ID " + id + " not found.");
        }
}
}
