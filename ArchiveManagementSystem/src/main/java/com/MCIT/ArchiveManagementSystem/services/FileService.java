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

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    // Save a single file
    public String savefile(MultipartFile file, Object entity) {
        try {
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
                logger.info("📁 د اپلوډ ډایرکټوری جوړ شو: {}", uploadDir);
            }

            String originalFileName = file.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Path filePath = Paths.get(uploadDir, uniqueFileName);
            
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            logger.info("✅ فایل په بریالیتوب سره ذخیره شو: {}", uniqueFileName);
            return uniqueFileName;
            
        } catch (IOException e) {
            logger.error("❌ د فایل د ذخیره کولو کې ستونزه: {}", e.getMessage());
            throw new RuntimeException("د فایل ذخیره کول ناکام شول: " + e.getMessage());
        }
    }

    // Save multiple files
    public List<String> savefiles(MultipartFile[] files, Object entity) {
        List<String> savedPaths = new ArrayList<>();
        
        try {
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
                logger.info("📁 د اپلوډ ډایرکټوری جوړ شو: {}", uploadDir);
            }

            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    String originalFileName = file.getOriginalFilename();
                    String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
                    Path filePath = Paths.get(uploadDir, uniqueFileName);
                    
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    savedPaths.add(uniqueFileName);
                    
                    logger.info("✅ فایل ذخیره شو: {}", uniqueFileName);
                }
            }
            
            return savedPaths;
            
        } catch (IOException e) {
            logger.error("❌ د فایلونو د ذخیره کولو کې ستونزه: {}", e.getMessage());
            throw new RuntimeException("د فایلونو ذخیره کول ناکام شول: " + e.getMessage());
        }
    }

    // Safe file deletion
    public void deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir, fileName);
            File file = filePath.toFile();
            
            if (file.exists()) {
                boolean deleted = Files.deleteIfExists(filePath);
                if (deleted) {
                    logger.info("✅ فایل په بریالیتوب سره حذف شو: {}", fileName);
                } else {
                    logger.warn("⚠️ فایل حذف نه شو: {}", fileName);
                }
            } else {
                logger.warn("⚠️ فایل ونه موندل شو (شاید مخکې له دې حذف شوی وي): {}", filePath);
            }
            
        } catch (IOException e) {
            logger.error("❌ د فایل د حذف کولو کې ستونزه {}: {}", fileName, e.getMessage());
        }
    }

    // Delete file entity
    public void deleteFileEntity(Long fileId) {
        try {
            logger.info("📝 د فایل حذف کول پیل کیږي - ID: {}", fileId);
            
            FileEntity fileEntity = fileRepository.findById(fileId)
                    .orElseThrow(() -> new RuntimeException("فایل ونه موندل شو - ID: " + fileId));
            
            String filePath = fileEntity.getFilePath();
            if (filePath != null && !filePath.isEmpty()) {
                deleteFile(filePath);
            }
            
            fileRepository.delete(fileEntity);
            
            logger.info("✅ فایل په بریالیتوب سره حذف شو - ID: {}", fileId);
            
        } catch (RuntimeException e) {
            logger.error("❌ فایل ونه موندل شو: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("❌ د فایل د حذف کولو کې ستونزه: {}", e.getMessage());
            throw new RuntimeException("د فایل حذف کول ناکام شول: " + e.getMessage());
        }
    }

    /**
     * Load file as resource for download/preview
     * Enhanced with clear Pashto error messages
     */
    public Resource loadFileAsResource(String fileName) {
        try {
            logger.info("🔍 د فایل لټون پیل کیږي: {}", fileName);
            logger.info("📁 اپلوډ ډایرکټوری: {}", uploadDir);
            
            // First, try exact match
            Path exactFilePath = Paths.get(uploadDir).resolve(fileName).normalize();
            logger.info("🔍 د فایل مستقیم لټون: {}", exactFilePath);
            
            Resource resource = new UrlResource(exactFilePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                logger.info("✅ فایل وموندل شو (مستقیم سره): {}", fileName);
                return resource;
            }
            
            // If exact match fails, search for file with UUID prefix
            logger.warn("⚠️ فایل په مستقیم ډول ونه موندل شو، د UUID سره لټون کیږي...");
            
            File directory = new File(uploadDir);
            if (directory.exists() && directory.isDirectory()) {
                File[] files = directory.listFiles((dir, name) -> name.endsWith("_" + fileName));
                
                if (files != null && files.length > 0) {
                    Path foundFilePath = files[0].toPath();
                    resource = new UrlResource(foundFilePath.toUri());
                    
                    logger.info("✅ فایل د UUID سره وموندل شو: {}", files[0].getName());
                    return resource;
                }
            }
            
            // File not found - throw clear Pashto error
            logger.error("❌ فایل نشته: {}", fileName);
            logger.error("📂 د ډایرکټوری ځای: {}", uploadDir);
            
            // List available files for debugging (limit to 20)
            if (directory.exists()) {
                File[] allFiles = directory.listFiles();
                if (allFiles != null && allFiles.length > 0) {
                    logger.error("📋 موجود فایلونه ({} فایلونه):", allFiles.length);
                    int count = 0;
                    for (File f : allFiles) {
                        if (count < 20) { // Only log first 20 files
                            logger.error("   - {}", f.getName());
                            count++;
                        }
                    }
                    if (allFiles.length > 20) {
                        logger.error("   ... او {} نور فایلونه", allFiles.length - 20);
                    }
                } else {
                    logger.error("   (ډایرکټوری خالي دی)");
                }
            } else {
                logger.error("   (ډایرکټوری نشته)");
            }
            
            // Throw exception with clear Pashto message
            throw new FileNotFoundException(
                "فایل په سرور کې نشته: " + fileName + 
                ". دا فایل شاید حذف شوی وي یا هیڅکله اپلوډ نه و شوی."
            );
            
        } catch (FileNotFoundException e) {
            // Re-throw our custom exception with Pashto message
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            logger.error("❌ د فایل د لوډ کولو کې ستونزه {}: {}", fileName, e.getMessage());
            throw new RuntimeException("د فایل لوډ کول ناکام شول: " + e.getMessage());
        }
    }
    
    /**
     * Custom exception for file not found
     */
    public static class FileNotFoundException extends Exception {
        public FileNotFoundException(String message) {
            super(message);
        }
    }
}