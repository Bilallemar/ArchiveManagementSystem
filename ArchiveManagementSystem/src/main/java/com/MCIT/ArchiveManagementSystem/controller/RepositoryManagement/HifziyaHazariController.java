package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.HifziyaHazariService;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;



import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/hifziya-hazari")
public class HifziyaHazariController {

    private final HifziyaHazariService hifziyaHazariService;
    private final FileService fileService;

    public HifziyaHazariController(HifziyaHazariService hifziyaHazariService, FileService fileService) {
        this.hifziyaHazariService = hifziyaHazariService;
        this.fileService = fileService;
    }


   
// @PostMapping(consumes = {"multipart/form-data"})
// public HifziyaHazari createHifziyaHazari(
//         @RequestPart("hifziyaHazari") String hifziyaHazari,
//         @RequestPart(value = "fileURL", required = false) MultipartFile fileURL
// ) throws IOException {

//     ObjectMapper mapper = new ObjectMapper();
//     mapper.registerModule(new JavaTimeModule());
//     HifziyaHazari recivedHifziyaHazari = mapper.readValue(hifziyaHazari, HifziyaHazari.class);

//     return hifziyaHazariService.createHifziyaHazari(recivedHifziyaHazari, fileURL);
// }
@PostMapping(consumes = {"multipart/form-data"})
public HifziyaHazari createHifziyaHazari(
        @RequestPart("hifziyaHazari") String hifziyaHazari,
        @RequestPart(value = "fileURL", required = false) MultipartFile fileURL
) throws IOException {

    // -------------------------------
    // 🔹 ډیباګ: چاپ کړئ JSON
    System.out.println("Received JSON: " + hifziyaHazari);

    if (fileURL != null) {
        System.out.println("Received File: " + fileURL.getOriginalFilename() + ", size=" + fileURL.getSize());
    } else {
        System.out.println("No file received");
    }
    // -------------------------------

    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    HifziyaHazari recivedHifziyaHazari = mapper.readValue(hifziyaHazari, HifziyaHazari.class);

    // 🔹 ډیباګ: چاپ کړئ Parsed Object
    System.out.println("Parsed HifziyaHazari: " + recivedHifziyaHazari);

    return hifziyaHazariService.createHifziyaHazari(recivedHifziyaHazari, fileURL);
}




    // Update AttendanceBook with optional file

    // Get all AttendanceBooks
    @GetMapping
    public List<HifziyaHazari> getAllHifziyaHazaris() {
        return hifziyaHazariService.getAllHifziyaHazaris();
    }

    @GetMapping("/{id}")
public ResponseEntity<HifziyaHazari>getHifziyaHazariById(@PathVariable Integer id) {
    return hifziyaHazariService.getHifziyaHazariById(id)
    .map(ResponseEntity::ok)
    .orElse(ResponseEntity.notFound().build());

}
    // Get AttendanceBook by ID
    @PutMapping("/{id}")
    public ResponseEntity<HifziyaHazari> updateHifziyaHazari(
        @PathVariable Integer id,
        @RequestPart("hifziyaHazari") String registrationJson,
         @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL    )         // JSON string د Receipts object لپاره
       {

    try {
        // JSON string parse کوو
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        HifziyaHazari recivedHifziyaHazari = mapper.readValue(registrationJson, HifziyaHazari.class);

        // service ته پاس کوو
        HifziyaHazari updatedHifziyaHazari = hifziyaHazariService.updateHifziyaHazari(id, recivedHifziyaHazari, fileURL);

        return ResponseEntity.ok(updatedHifziyaHazari);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
    // Delete AttendanceBook by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHifziyaHazari(@PathVariable Integer id) {
        hifziyaHazariService.deleteHifziyaHazari(id);
        return ResponseEntity.ok("HifziyaHazari with ID " + id + " has been deleted successfully.");
    }

  @GetMapping("/download/{filename:.+}")
public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
    Resource resource = fileService.loadFileAsResource(filename);

    return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + resource.getFilename() + "\"")
            .body(resource);
}

}
