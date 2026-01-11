package com.MCIT.ArchiveManagementSystem.controller;

import com.MCIT.ArchiveManagementSystem.services.ScannerFolderWatcherService;
import com.MCIT.ArchiveManagementSystem.services.ScannerFolderWatcherService.FileInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/scanner-folder")
@CrossOrigin(origins = "*")
public class ScannerFolderController {
    
    private final ScannerFolderWatcherService watcherService;
    
    public ScannerFolderController(ScannerFolderWatcherService watcherService) {
        this.watcherService = watcherService;
    }
    
    /**
     * Get all files currently detected in the scanner folder
     */
    @GetMapping("/files")
    public ResponseEntity<List<FileInfo>> getDetectedFiles() {
        List<FileInfo> files = watcherService.getDetectedFiles();
        return ResponseEntity.ok(files);
    }
    
    /**
     * Get scanner folder path
     */
    @GetMapping("/path")
    public ResponseEntity<Map<String, String>> getScannerFolderPath() {
        Map<String, String> response = new HashMap<>();
        response.put("path", watcherService.getScannerFolderPath());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Clear all detected files from the list (doesn't delete actual files)
     */
    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearDetectedFiles() {
        watcherService.clearDetectedFiles();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Detected files list cleared");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Delete a specific file from the scanner folder
     */
    @DeleteMapping("/files/{filename}")
    public ResponseEntity<Map<String, Object>> deleteFile(@PathVariable String filename) {
        boolean deleted = watcherService.deleteFile(filename);
        Map<String, Object> response = new HashMap<>();
        response.put("success", deleted);
        response.put("message", deleted ? "File deleted successfully" : "Failed to delete file");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Download a file from the scanner folder
     */
    @GetMapping("/files/{filename}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(watcherService.getScannerFolderPath()).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                           "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get files and clear the list (useful for processing)
     */
    @PostMapping("/files/fetch-and-clear")
    public ResponseEntity<List<FileInfo>> fetchAndClearFiles() {
        List<FileInfo> files = watcherService.getAndClearFiles();
        return ResponseEntity.ok(files);
    }
}