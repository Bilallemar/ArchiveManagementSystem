package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.HifziyaHazariService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/hifziya-hazari")
public class HifziyaHazariController {

    private final HifziyaHazariService hifziyaHazariService;
    // private final FileService fileService;

    public HifziyaHazariController(HifziyaHazariService hifziyaHazariService) {
        this.hifziyaHazariService = hifziyaHazariService;
        // this.fileService = fileService;
    }


   @PostMapping
    public HifziyaHazari createHifziyaHazari
    (@RequestBody String hifziyaHazari
      ) throws IOException {


        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        HifziyaHazari recivedHifziyaHazari = mapper.readValue(hifziyaHazari, HifziyaHazari.class);



        return hifziyaHazariService.createHifziyaHazari(recivedHifziyaHazari);
    }




    // Update AttendanceBook with optional file

    // Get all AttendanceBooks
    @GetMapping
    public List<HifziyaHazari> getAllHifziyaHazaris() {
        return hifziyaHazariService.getAllHifziyaHazaris();
    }

    // Get AttendanceBook by ID
    @GetMapping("/{id}")
    public ResponseEntity<HifziyaHazari> getHifziyaHazariById(@PathVariable Integer id) {
        return hifziyaHazariService.getHifziyaHazariById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
public HifziyaHazari updateEmpoymentOffice(
        @PathVariable Integer id,
        @RequestBody HifziyaHazari hifziyaHazari
        ) {
    return hifziyaHazariService.updateHifziyaHazari(id, hifziyaHazari);
}
    // Delete AttendanceBook by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHifziyaHazari(@PathVariable Integer id) {
        hifziyaHazariService.deleteHifziyaHazari(id);
        return ResponseEntity.ok("HifziyaHazari with ID " + id + " has been deleted successfully.");
    }

    // Download attached file by filename
    // @GetMapping("/download/{filename:.+}")
    // public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
    //     Resource resource = fileService.loadFileAsResource(filename);

    //     return ResponseEntity.ok()
    //             .contentType(MediaType.APPLICATION_OCTET_STREAM)
    //             .header(HttpHeaders.CONTENT_DISPOSITION,
    //                     "attachment; filename=\"" + resource.getFilename() + "\"")
    //             .body(resource);
    // }
}
