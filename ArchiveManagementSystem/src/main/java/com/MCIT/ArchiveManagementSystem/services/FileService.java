package com.MCIT.ArchiveManagementSystem.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class FileService {
    
    private static final Logger logger = LoggerFactory.getLogger(FileService.class);
    
@Value("${spring.file.directory}")
    private String uploadDir;
    
    private final FileRepository fileRepository;

    // ✅ Constructor with FileRepository injection
    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    // Save a single file
    public String savefile(MultipartFile file, Object entity) {
        try {
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
                logger.info("Created upload directory: {}", uploadDir);
            }

            String originalFileName = file.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Path filePath = Paths.get(uploadDir, uniqueFileName);
            
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            logger.info("File saved to disk: {}", uniqueFileName);
            return uniqueFileName;
            
        } catch (IOException e) {
            logger.error("Failed to save file: {}", e.getMessage());
            throw new RuntimeException("Could not save file: " + e.getMessage());
        }
    }

    // Save multiple files
    public List<String> savefiles(MultipartFile[] files, Object entity) {
        List<String> savedPaths = new ArrayList<>();
        
        try {
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
                logger.info("Created upload directory: {}", uploadDir);
            }

            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    String originalFileName = file.getOriginalFilename();
                    String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
                    Path filePath = Paths.get(uploadDir, uniqueFileName);
                    
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    savedPaths.add(uniqueFileName);
                    
                    logger.info("File saved to disk: {}", uniqueFileName);
                }
            }
            
            return savedPaths;
            
        } catch (IOException e) {
            logger.error("Failed to save files: {}", e.getMessage());
            throw new RuntimeException("Could not save files: " + e.getMessage());
        }
    }

    // Safe file deletion - doesn't throw exception if file doesn't exist
    public void deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir, fileName);
            File file = filePath.toFile();
            
            if (file.exists()) {
                boolean deleted = Files.deleteIfExists(filePath);
                if (deleted) {
                    logger.info("✅ File deleted successfully: {}", fileName);
                } else {
                    logger.warn("⚠️ File could not be deleted: {}", fileName);
                }
            } else {
                logger.warn("⚠️ File not found (may have been already deleted): {}", filePath);
            }
            
        } catch (IOException e) {
            logger.error("❌ Error deleting file {}: {}", fileName, e.getMessage());
        }
    }

    // ✅ NEW: Delete file entity (both from database and disk)
    public void deleteFileEntity(Long fileId) {
        try {
            logger.info("Attempting to delete file entity with ID: {}", fileId);
            
            // Find the file entity
            FileEntity fileEntity = fileRepository.findById(fileId)
                    .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));
            
            // Delete the physical file from disk
            String filePath = fileEntity.getFilePath();
            if (filePath != null && !filePath.isEmpty()) {
                deleteFile(filePath);
            }
            
            // Delete the database record
            fileRepository.delete(fileEntity);
            
            logger.info("✅ File entity deleted successfully with ID: {}", fileId);
            
        } catch (RuntimeException e) {
            logger.error("❌ File entity not found: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("❌ Error deleting file entity: {}", e.getMessage());
            throw new RuntimeException("Could not delete file entity: " + e.getMessage());
        }
    }

    // Load file as resource for download
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                logger.info("Loading file for download: {}", fileName);
                return resource;
            } else {
                logger.error("File not found or not readable: {}", fileName);
                throw new RuntimeException("File not found: " + fileName);
            }
            
        } catch (Exception e) {
            logger.error("Error loading file {}: {}", fileName, e.getMessage());
            throw new RuntimeException("Could not load file: " + e.getMessage());
        }
    }
}