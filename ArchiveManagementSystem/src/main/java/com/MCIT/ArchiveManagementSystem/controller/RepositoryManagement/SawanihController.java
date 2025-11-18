package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.SawanihRepository;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.SawanihService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;


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

    
    public SawanihController( SawanihService sawanihService,
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
    public List<Sawanih > getAllSawanih() {
        return sawanihService.getAllSawanihs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sawanih> getSawanihById(@PathVariable Integer id) {
        return sawanihService.getSawanihById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Original create endpoint (kept for backward compatibility)
    @PostMapping
    public Sawanih createSawanih(@RequestPart("Sawanih") String receivedIssuedBookRepository,@RequestPart(value = "fileURL", required = true) MultipartFile fileURL) throws IOException {


        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Sawanih recivedReceivedIssuedBookRepository = mapper.readValue(receivedIssuedBookRepository, Sawanih.class);



        return sawanihService.createSawanih(recivedReceivedIssuedBookRepository, fileURL);
    }



@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Sawanih> updateReceipt(
        @PathVariable Integer id,
        @RequestPart("Sawanih") String receivedIssuedBookRepository,
        @RequestPart(value = "fileURL", required = false) MultipartFile fileURL) {

    try {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Sawanih recivedReceivedIssuedBookRepository = mapper.readValue(receivedIssuedBookRepository, Sawanih.class);

        // Sawanih existingReceivedIssuedBookRepository = sawanihService.getSawanihById(id)
        //                             .orElseThrow(() -> new RuntimeException("Sawanih not found"));

        // if (fileURL != null && !fileURL.isEmpty()) {
        //     String newFilePath = fileService.savefile(fileURL, existingReceivedIssuedBookRepository);

        //     FileEntity newFileEntity = new FileEntity();
        //     newFileEntity.setFilePath(newFilePath);
        //     newFileEntity.setFileName(fileURL.getOriginalFilename());
        //     newFileEntity.setFileType(fileURL.getContentType());
        //     newFileEntity.setSawanih(existingReceivedIssuedBookRepository);

        //     List<FileEntity> attachments = existingReceivedIssuedBookRepository.getAttachments();
        //     attachments.add(newFileEntity);

        //     recivedReceivedIssuedBookRepository.setAttachments(attachments);
        // } else {
        //     recivedReceivedIssuedBookRepository.setAttachments(existingReceivedIssuedBookRepository.getAttachments());
        // }

        // اړین دی چې ID وساتل شي ترڅو اپډېټ وشي نه نو به نوی ریکارډ جوړ شي
        recivedReceivedIssuedBookRepository.setId(id);

        Sawanih updatedReceivedIssuedBookRepository = sawanihService.updateSawanih(id, recivedReceivedIssuedBookRepository,fileURL);

        return ResponseEntity.ok(updatedReceivedIssuedBookRepository);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSawanih(@PathVariable Integer id) {
        try {
            // Optional: Add file deletion logic here if you want to delete associated files
            sawanihService.deleteSawanih(id);
            return ResponseEntity.ok().body("ReceivedIssuedBooKRepository with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("ReceivedIssuedBookRepository with ID " + id + " not found.");
        }
    }

// @GetMapping("/download/{filename:.+}")
// public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
//     try {
//         Resource resource = fileService.loadFileAsResource(filename);
//         return ResponseEntity.ok()
//                 .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                 .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
//                 .body(resource);
//     } catch (RuntimeException e) {
//         return ResponseEntity.notFound().build();
//     }
// }

// @GetMapping("/search")
// public List<Sawanih> searchReceivedIssuedBookRepositories(
//         @RequestParam(required = false) String keyword,
//         @RequestParam(required = false) String field) {
//     return sawanihService.searchByKeyword(field, keyword);
// }

}