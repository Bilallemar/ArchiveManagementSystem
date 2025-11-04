
package com.MCIT.ArchiveManagementSystem.controller;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.Receipts;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.ReceiptsRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final Path uploadDir;
    private final FileRepository fileRepository;
    private final ReceiptsRepository receiptsRepository;

    public FileController(
            @Value("${file.upload-dir:uploads}") String uploadDir,
            FileRepository fileRepository,
            ReceiptsRepository receiptsRepository) throws IOException {
        
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.fileRepository = fileRepository;
        this.receiptsRepository = receiptsRepository;
        
        // Create upload directory if it doesn't exist
        Files.createDirectories(this.uploadDir);
    }

    /**
     * Upload a file and associate it with a receipt
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("receiptId") Long receiptId) {
        
        try {
            // Validate receipt exists
            Receipts receipt = receiptsRepository.findById(receiptId)
                    .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + receiptId));

            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            // Clean filename safely
            String originalFilename = StringUtils.cleanPath(
                    Objects.requireNonNull(file.getOriginalFilename(), "Filename cannot be null")
            );

            // Extract file extension safely
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf(".");
            if (dotIndex > 0) {
                fileExtension = originalFilename.substring(dotIndex);
            }

            // Generate unique filename
            String uniqueFilename = UUID.randomUUID() + fileExtension;

            // Store file
            Path targetPath = uploadDir.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Fallback for content type
            String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

            // Create file entity
            FileEntity fileEntity = new FileEntity();
            fileEntity.setFileName(originalFilename);
            fileEntity.setFilePath(targetPath.toString());
            fileEntity.setFileType(contentType);
            fileEntity.setReceipt(receipt);

            FileEntity savedFile = fileRepository.save(fileEntity);

            return ResponseEntity.ok(savedFile);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request: " + e.getMessage());
        }
    }

    /**
     * Download a file by its ID
     */
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        try {
            FileEntity fileEntity = fileRepository.findById(fileId)
                    .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));

            Path filePath = Paths.get(fileEntity.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Could not read file: " + fileEntity.getFileName());
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(fileEntity.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + fileEntity.getFileName() + "\"")
                    .body(resource);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a file by its ID
     */
    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId) {
        try {
            FileEntity fileEntity = fileRepository.findById(fileId)
                    .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));

            // Delete physical file
            Path filePath = Paths.get(fileEntity.getFilePath());
            Files.deleteIfExists(filePath);

            // Delete database record
            fileRepository.delete(fileEntity);

            return ResponseEntity.ok("File deleted successfully");

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not delete file: " + e.getMessage());
        }
    }
}




