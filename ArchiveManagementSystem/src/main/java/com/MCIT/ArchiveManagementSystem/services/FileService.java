package com.MCIT.ArchiveManagementSystem.services;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.*;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.*;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class FileService {

    private static final Logger logger = LoggerFactory.getLogger(FileService.class);
    
    private final Path root;
    private final FileRepository fileRepository;

    public FileService(@Value("${spring.file.directory}") String uploadDir,
                       FileRepository fileRepository) {
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.fileRepository = fileRepository;

        try {
            Files.createDirectories(root);
            logger.info("Upload directory initialized at: {}", root);
        } catch (IOException e) {
            logger.error("Could not initialize folder for upload!", e);
            throw new RuntimeException("Could not initialize folder for upload!", e);
        }
    }

    public Path getFile(String filename) {
        return root.resolve(filename).normalize();
    }

    public Stream<Path> listFiles() {
        try {
            return Files.walk(this.root, 1)
                    .filter(path -> !path.equals(this.root))
                    .map(this.root::relativize);
        } catch (IOException e) {
            logger.error("Could not list the files!", e);
            throw new RuntimeException("Could not list the files!", e);
        }
    }

public void deleteFile(String filePath) {
    try {
        Path path = root.resolve(filePath).normalize();
        File file = path.toFile();

        if (file.exists()) {
            boolean deleted = file.delete();
            if (deleted) {
                logger.info("File deleted: {}", path);
            } else {
                logger.warn("File deletion returned false: {}", path);
            }
        } else {
            logger.warn("File not found (may have been already deleted): {}", path);
        }

    } catch (Exception e) {
        logger.error("Error deleting file: {}", filePath, e);
        // Don't rethrow - just log the error
    }
}


    @Transactional
    public <T> List<String> savefiles(MultipartFile[] files, T owner) {
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("No files provided.");
        }

        List<String> savedFilenames = new ArrayList<>();
        List<Path> savedPaths = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    logger.warn("Skipping empty file");
                    continue;
                }

                // Generate unique filename
                String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path targetPath = root.resolve(uniqueFileName);

                // Save physical file
                try (InputStream inputStream = file.getInputStream()) {
                    Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
                    logger.info("File saved to disk: {}", uniqueFileName);
                }

                savedPaths.add(targetPath);

                // Create and populate file entity
                FileEntity fileEntity = new FileEntity();
                fileEntity.setFilePath(uniqueFileName); // Store only filename for consistency
                fileEntity.setFileName(file.getOriginalFilename());
                fileEntity.setFileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");

                // Assign owner based on type
                assignOwner(fileEntity, owner);

                // Save to database
                fileRepository.save(fileEntity);
                savedFilenames.add(uniqueFileName);
                
                logger.info("File entity saved to database: {}", uniqueFileName);
            }

            return savedFilenames;

        } catch (IOException e) {
            logger.error("File upload failed, rolling back", e);
            // Rollback: delete any files that were saved
            rollbackFiles(savedPaths);
            throw new RuntimeException("File upload failed: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error during file upload", e);
            // Rollback: delete any files that were saved
            rollbackFiles(savedPaths);
            throw new RuntimeException("File upload failed: " + e.getMessage(), e);
        }
    }

    @Transactional
    public <T> String savefile(MultipartFile file, T owner) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null.");
        }
        List<String> paths = savefiles(new MultipartFile[]{file}, owner);
        return paths.isEmpty() ? null : paths.get(0);
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = getFile(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                logger.info("File loaded successfully: {}", fileName);
                return resource;
            } else {
                logger.error("File not found or not readable: {}", fileName);
                throw new RuntimeException("File not found or not readable: " + fileName);
            }
        } catch (MalformedURLException e) {
            logger.error("Malformed URL for file: {}", fileName, e);
            throw new RuntimeException("File not found: " + fileName, e);
        }
    }

    private <T> void assignOwner(FileEntity fileEntity, T owner) {
        if (owner instanceof MakzanReceipt) {
            fileEntity.setMakzanReceipt((MakzanReceipt) owner);}
else if (owner instanceof HifziyaWaradaSadera) {
    fileEntity.setHifziyaWaradaSadera((HifziyaWaradaSadera) owner);
}  else if (owner instanceof HifziyaHazari) {
    fileEntity.setHifziyaHazari((HifziyaHazari) owner);

        } else {
            throw new IllegalArgumentException("Unsupported owner type: " + owner.getClass().getName());
        }
    }
    
    private void rollbackFiles(List<Path> paths) {
        for (Path path : paths) {
            try {
                Files.deleteIfExists(path);
                logger.info("Rolled back file: {}", path.getFileName());
            } catch (IOException e) {
                logger.error("Failed to rollback file: {}", path.getFileName(), e);
            }
        }
    }

    @Transactional
    public void deleteFileEntity(Long fileId) {
        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));

        // Delete physical file
        deleteFile(fileEntity.getFilePath());

        // Delete database record
        fileRepository.delete(fileEntity);
        
        logger.info("File entity and physical file deleted successfully: {}", fileEntity.getFilePath());
    }
}