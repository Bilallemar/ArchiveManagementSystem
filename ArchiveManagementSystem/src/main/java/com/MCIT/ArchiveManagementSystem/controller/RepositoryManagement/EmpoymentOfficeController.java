package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.EmpoymentOffice;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.EmpoymentOfficeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/empoymentOffice")
public class EmpoymentOfficeController {

    private final EmpoymentOfficeService empoymentOfficeService;
    private final FileService fileService;

    public EmpoymentOfficeController(EmpoymentOfficeService empoymentOfficeService, FileService fileService) {
        this.empoymentOfficeService = empoymentOfficeService;
        this.fileService = fileService;
    }


   @PostMapping
    public EmpoymentOffice createAttendanceBook
    (@RequestPart("empoymentOffice") String empoymentOffice,
    @RequestPart(value = "fileURL", required = true) MultipartFile fileURL) throws IOException {


        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        EmpoymentOffice recivedEmpoymentOffice = mapper.readValue(empoymentOffice, EmpoymentOffice.class);



        return empoymentOfficeService.createEmpoymentOffice(recivedEmpoymentOffice, fileURL);
    }




    // Update AttendanceBook with optional file
    @PutMapping("/{id}")
public EmpoymentOffice updateEmpoymentOffice(
        @PathVariable Long id,
        @RequestPart("empoymentOffice") EmpoymentOffice empoymentOffice,
        @RequestPart(value = "files", required = false) MultipartFile[] files) {
    return empoymentOfficeService.updateEmpoymentOffice(id, empoymentOffice, files);
}
    // Get all AttendanceBooks
    @GetMapping
    public List<EmpoymentOffice> getAllEmpoymentOffices() {
        return empoymentOfficeService.getAllEmpoymentOffices();
    }

    // Get AttendanceBook by ID
    @GetMapping("/{id}")
    public ResponseEntity<EmpoymentOffice> getEmpoymentOfficeById(@PathVariable Long id) {
        return empoymentOfficeService.getEmpoymentOfficeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete AttendanceBook by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmpoymentOffice(@PathVariable Long id) {
        empoymentOfficeService.deleteEmpoymentOffice(id);
        return ResponseEntity.ok("EmpoymentOffice with ID " + id + " has been deleted successfully.");
    }

    // Download attached file by filename
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
