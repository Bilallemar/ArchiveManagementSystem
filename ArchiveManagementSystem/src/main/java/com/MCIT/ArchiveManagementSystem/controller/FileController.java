package com.MCIT.ArchiveManagementSystem.controller;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaHazariRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaWaradaSaderaRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    private final FileService fileService;
    private final FileRepository fileRepository;
    private final MakzanReceiptRepository makzanReceiptRepository;
    private final HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository;
    private final HifziyaHazariRepository hifziyaHazariRepository;

    
    public FileController(FileService fileService,
                          FileRepository fileRepository,
                          MakzanReceiptRepository makzanReceiptRepository,
                          HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository,
                          HifziyaHazariRepository hifziyaHazariRepository) {
        this.fileService = fileService;
        this.fileRepository = fileRepository;
        this.makzanReceiptRepository = makzanReceiptRepository;
        this.hifziyaWaradaSaderaRepository = hifziyaWaradaSaderaRepository;
        this.hifziyaHazariRepository = hifziyaHazariRepository;
    }

    // ==================== MakzanReceipt File Operations ====================

    @PostMapping("/makzan-receipt/{id}/upload")
    public ResponseEntity<?> uploadFileToMakzanReceipt(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        try {
            logger.info("Upload request received for MakzanReceipt id: {}", id);

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("File is empty"));
            }

            MakzanReceipt makzanReceipt = makzanReceiptRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("MakzanReceipt not found with id: " + id));

            String savedFilename = fileService.savefile(file, makzanReceipt);

            FileEntity fileEntity = fileRepository.findByFilePath(savedFilename)
                    .orElseThrow(() -> new RuntimeException("File not found after saving"));

            logger.info("File uploaded successfully to MakzanReceipt: {}", savedFilename);

            return ResponseEntity.ok(createSuccessResponse("File uploaded successfully", fileEntity));

        } catch (Exception e) {
            logger.error("Error uploading file to MakzanReceipt", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to upload file: " + e.getMessage()));
        }
    }

    @PostMapping("/makzan-receipt/{id}/upload-multiple")
    public ResponseEntity<?> uploadMultipleFilesToMakzanReceipt(
            @PathVariable Integer id,
            @RequestParam("files") MultipartFile[] files) {
        try {
            logger.info("Multiple upload request received for MakzanReceipt id: {}", id);

            if (files == null || files.length == 0) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("No files provided"));
            }

            MakzanReceipt makzanReceipt = makzanReceiptRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("MakzanReceipt not found with id: " + id));

            List<String> savedFilenames = fileService.savefiles(files, makzanReceipt);
            List<FileEntity> fileEntities = fileRepository.findAllByFilePathIn(savedFilenames);

            logger.info("{} files uploaded successfully to MakzanReceipt", savedFilenames.size());

            return ResponseEntity.ok(createSuccessResponse("Files uploaded successfully", fileEntities));

        } catch (Exception e) {
            logger.error("Error uploading multiple files to MakzanReceipt", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to upload files: " + e.getMessage()));
        }
    }

    @GetMapping("/makzan-receipt/{id}/files")
    public ResponseEntity<?> getFilesByMakzanReceipt(@PathVariable Integer id) {
        try {
            logger.info("Files request received for MakzanReceipt id: {}", id);

            makzanReceiptRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("MakzanReceipt not found with id: " + id));

            List<FileEntity> files = fileRepository.findByMakzanReceiptId(id);

            return ResponseEntity.ok(files);

        } catch (Exception e) {
            logger.error("Error retrieving files for MakzanReceipt", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to retrieve files"));
        }
    }

    // ==================== HifziyaWaradaSadera File Operations ====================

    @PostMapping("/hifziya-warada-sadera/{id}/upload")
    public ResponseEntity<?> uploadFileToHifziyaWaradaSadera(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        try {
            logger.info("Upload request received for HifziyaWaradaSadera id: {}", id);

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("File is empty"));
            }

            HifziyaWaradaSadera hifziya = hifziyaWaradaSaderaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("HifziyaWaradaSadera not found with id: " + id));

            String savedFilename = fileService.savefile(file, hifziya);

            FileEntity fileEntity = fileRepository.findByFilePath(savedFilename)
                    .orElseThrow(() -> new RuntimeException("File not found after saving"));

            logger.info("File uploaded successfully to HifziyaWaradaSadera: {}", savedFilename);

            return ResponseEntity.ok(createSuccessResponse("File uploaded successfully", fileEntity));

        } catch (Exception e) {
            logger.error("Error uploading file to HifziyaWaradaSadera", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to upload file: " + e.getMessage()));
        }
    }

    @PostMapping("/hifziya-warada-sadera/{id}/upload-multiple")
    public ResponseEntity<?> uploadMultipleFilesToHifziyaWaradaSadera(
            @PathVariable Integer id,
            @RequestParam("files") MultipartFile[] files) {
        try {
            logger.info("Multiple upload request received for HifziyaWaradaSadera id: {}", id);

            if (files == null || files.length == 0) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("No files provided"));
            }

            HifziyaWaradaSadera hifziya = hifziyaWaradaSaderaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("HifziyaWaradaSadera not found with id: " + id));

            List<String> savedFilenames = fileService.savefiles(files, hifziya);
            List<FileEntity> fileEntities = fileRepository.findAllByFilePathIn(savedFilenames);

            logger.info("{} files uploaded successfully to HifziyaWaradaSadera", savedFilenames.size());

            return ResponseEntity.ok(createSuccessResponse("Files uploaded successfully", fileEntities));

        } catch (Exception e) {
            logger.error("Error uploading multiple files to HifziyaWaradaSadera", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to upload files: " + e.getMessage()));
        }
    }

    @GetMapping("/hifziya-warada-sadera/{id}/files")
    public ResponseEntity<?> getFilesByHifziyaWaradaSadera(@PathVariable Integer id) {
        try {
            logger.info("Files request received for HifziyaWaradaSadera id: {}", id);

            hifziyaWaradaSaderaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("HifziyaWaradaSadera not found with id: " + id));

            List<FileEntity> files = fileRepository.findByHifziyaWaradaSaderaId(id);

            return ResponseEntity.ok(files);

        } catch (Exception e) {
            logger.error("Error retrieving files for HifziyaWaradaSadera", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to retrieve files"));
        }
    }

    // ==================== HifziyaHazari File Operations ====================

    @PostMapping("/hifziya-hazari/{id}/upload")
    public ResponseEntity<?> uploadFileToHifziyaHazari(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        try {
            logger.info("Upload request received for HifziyaHazari id: {}", id);

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("File is empty"));
            }

            HifziyaHazari hifziya = hifziyaHazariRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("HifziyaHazari not found with id: " + id));

            String savedFilename = fileService.savefile(file, hifziya);

            FileEntity fileEntity = fileRepository.findByFilePath(savedFilename)
                    .orElseThrow(() -> new RuntimeException("File not found after saving"));

            logger.info("File uploaded successfully to HifziyaHazari: {}", savedFilename);

            return ResponseEntity.ok(createSuccessResponse("File uploaded successfully", fileEntity));

        } catch (Exception e) {
            logger.error("Error uploading file to HifziyaHazari", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to upload file: " + e.getMessage()));
        }
    }

    @PostMapping("/hifziya-hazari/{id}/upload-multiple")
    public ResponseEntity<?> uploadMultipleFilesToHifziyaHazari(
            @PathVariable Integer id,
            @RequestParam("files") MultipartFile[] files) {
        try {
            logger.info("Multiple upload request received for HifziyaHazari id: {}", id);

            if (files == null || files.length == 0) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("No files provided"));
            }

            HifziyaHazari hifziya = hifziyaHazariRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("HifziyaHazari not found with id: " + id));

            List<String> savedFilenames = fileService.savefiles(files, hifziya);
            List<FileEntity> fileEntities = fileRepository.findAllByFilePathIn(savedFilenames);

            logger.info("{} files uploaded successfully to HifziyaHazari", savedFilenames.size());

            return ResponseEntity.ok(createSuccessResponse("Files uploaded successfully", fileEntities));

        } catch (Exception e) {
            logger.error("Error uploading multiple files to HifziyaHazari", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to upload files: " + e.getMessage()));
        }
    }

    @GetMapping("/hifziya-hazari/{id}/files")
    public ResponseEntity<?> getFilesByHifziyaHazari(@PathVariable Integer id) {
        try {
            logger.info("Files request received for HifziyaHazari id: {}", id);

            hifziyaHazariRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("HifziyaHazari not found with id: " + id));

            List<FileEntity> files = fileRepository.findByHifziyaHazariId(id);

            return ResponseEntity.ok(files);

        } catch (Exception e) {
            logger.error("Error retrieving files for HifziyaHazari", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to retrieve files"));
        }
    }

    // ==================== Common File Operations ====================

    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        try {
            logger.info("Download request received for fileId: {}", fileId);

            FileEntity fileEntity = fileRepository.findById(fileId)
                    .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));

            Resource resource = fileService.loadFileAsResource(fileEntity.getFilePath());

            String contentType = fileEntity.getFileType();
            if (contentType == null || contentType.isEmpty()) {
                contentType = "application/octet-stream";
            }

            logger.info("File downloaded successfully: {}", fileEntity.getFileName());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + fileEntity.getFileName() + "\"")
                    .body(resource);

        } catch (RuntimeException e) {
            logger.error("File not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Error during file download", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<?> getFileMetadata(@PathVariable Long fileId) {
        try {
            logger.info("Metadata request received for fileId: {}", fileId);

            FileEntity fileEntity = fileRepository.findById(fileId)
                    .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));

            return ResponseEntity.ok(fileEntity);

        } catch (RuntimeException e) {
            logger.error("File not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error retrieving file metadata", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to retrieve file metadata"));
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId) {
        try {
            logger.info("Delete request received for fileId: {}", fileId);

            fileService.deleteFileEntity(fileId);

            logger.info("File deleted successfully with id: {}", fileId);

            return ResponseEntity.ok(createSuccessResponse("File deleted successfully", null));

        } catch (RuntimeException e) {
            logger.error("Error deleting file: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during file deletion", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to delete file: " + e.getMessage()));
        }
    }

    // ==================== Helper Methods ====================

    private Map<String, Object> createSuccessResponse(String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        if (data != null) {
            response.put("data", data);
        }
        return response;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }
}