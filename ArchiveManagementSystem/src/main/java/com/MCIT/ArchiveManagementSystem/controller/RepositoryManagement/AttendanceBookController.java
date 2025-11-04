package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.AttendanceBook;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.AttendanceBookService;
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
@RequestMapping("/api/attendanceBook")
public class AttendanceBookController {

    private final AttendanceBookService attendanceBookService;
    private final FileService fileService;

    public AttendanceBookController(AttendanceBookService attendanceBookService, FileService fileService) {
        this.attendanceBookService = attendanceBookService;
        this.fileService = fileService;
    }


   @PostMapping
    public AttendanceBook createAttendanceBook
    (@RequestPart("attendanceBook") String attendanceBook,
   @RequestPart(value = "fileURL", required = true) MultipartFile fileURL) throws IOException {


        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        AttendanceBook recivedattendanceBook = mapper.readValue(attendanceBook, AttendanceBook.class);
        return attendanceBookService.createAttendanceBook(recivedattendanceBook, fileURL);
    }




    // Update AttendanceBook with optional file
    @PutMapping("/{id}")
public AttendanceBook updateAttendanceBook(
        @PathVariable Long id,
        @RequestPart("attendanceBook") AttendanceBook attendanceBook,
        @RequestPart(value = "files", required = false) MultipartFile[] files) {
    return attendanceBookService.updateAttendanceBook(id, attendanceBook, files);
}
    // Get all AttendanceBooks
    @GetMapping
    public List<AttendanceBook> getAllAttendanceBooks() {
        return attendanceBookService.getAllAttendanceBooks();
    }

    // Get AttendanceBook by ID
    @GetMapping("/{id}")
    public ResponseEntity<AttendanceBook> getAttendanceBookById(@PathVariable Long id) {
        return attendanceBookService.getAttendanceBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete AttendanceBook by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttendanceBook(@PathVariable Long id) {
        attendanceBookService.deleteAttendanceBook(id);
        return ResponseEntity.ok("AttendanceBook with ID " + id + " has been deleted successfully.");
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
