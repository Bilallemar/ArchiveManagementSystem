package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.AuditLog;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaWaradaSaderaRepository;

import jakarta.transaction.Transactional;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;
import com.MCIT.ArchiveManagementSystem.repositories.AuditLogRepository;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;

@Service
public class HifziyaWaradaSaderaService {
    private static final Logger logger = LoggerFactory.getLogger(HifziyaWaradaSaderaService.class);
 private static final String TABLE_NAME = "HifziyaWaradaSadera";
    private final HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository;
    private final FileRepository fileRepository;
    private final FileService fileService;
    private final AuditLogRepository auditLogRepository;
       private final AuditLogHelper auditLogHelper;

    
    public HifziyaWaradaSaderaService(
            HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository, 
            FileRepository fileRepository, 
            FileService fileService, 
            AuditLogRepository auditLogRepository,AuditLogHelper auditLogHelper) {
        this.hifziyaWaradaSaderaRepository = hifziyaWaradaSaderaRepository;
        this.fileRepository = fileRepository;
        this.fileService = fileService;
        this.auditLogRepository = auditLogRepository;
        this.auditLogHelper = auditLogHelper;
    }

    

    public List<HifziyaWaradaSadera> getAllHifziyaWaradaSadera() {
        return hifziyaWaradaSaderaRepository.findAll();
    }
    
    public Optional<HifziyaWaradaSadera> getHifziyaWaradaSaderaById(Integer id) {
        return hifziyaWaradaSaderaRepository.findById(id);
    }

    @Transactional
    public HifziyaWaradaSadera createHifziyaWaradaSadera(HifziyaWaradaSadera hifziyaWaradaSadera, MultipartFile[] fileURL) {
        System.out.println("Saving HifziyaWaradaSadera: " + hifziyaWaradaSadera);
        
        // Save the main entity first (without files)
        hifziyaWaradaSadera = hifziyaWaradaSaderaRepository.save(hifziyaWaradaSadera);
        
        if (fileURL != null && fileURL.length > 0) {
            System.out.println("Saving " + fileURL.length + " files");
            
            // Save all files using fileService
            List<String> storedPaths = fileService.savefiles(fileURL, hifziyaWaradaSadera);
            
            // Create FileEntity for each uploaded file
            List<FileEntity> fileEntities = new ArrayList<>();
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];
                FileEntity fileEntity = new FileEntity();
                fileEntity.setFilePath(storedPaths.get(i));
                fileEntity.setFileName(file.getOriginalFilename());
                fileEntity.setFileType(file.getContentType());
                fileEntity.setHifziyaWaradaSadera(hifziyaWaradaSadera);
                fileRepository.save(fileEntity);
                fileEntities.add(fileEntity);
                
                System.out.println("Saved file " + (i+1) + ": " + file.getOriginalFilename());
            }
            
            hifziyaWaradaSadera.setFiles(fileEntities);
        } else {
            System.out.println("No files to save in Service");
        }

        auditLogHelper.logCreate(TABLE_NAME, hifziyaWaradaSadera.getId().longValue(), 
            hifziyaWaradaSadera.getDescription());

        return hifziyaWaradaSadera;
    }

    @Transactional
    public HifziyaWaradaSadera updateHifziyaWaradaSadera(Integer id, HifziyaWaradaSadera hifziyaWaradaSaderaDetails, MultipartFile[] fileURL) {

        HifziyaWaradaSadera existingDoc = hifziyaWaradaSaderaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HifziyaWaradaSadera not found with id: " + id));

        // ---- Basic field updates ----
        existingDoc.setLetterNumber(hifziyaWaradaSaderaDetails.getLetterNumber());
        existingDoc.setIncommingDate(hifziyaWaradaSaderaDetails.getIncommingDate());
        existingDoc.setOutgoingDate(hifziyaWaradaSaderaDetails.getOutgoingDate());
        existingDoc.setSummary(hifziyaWaradaSaderaDetails.getSummary());
        existingDoc.setDescription(hifziyaWaradaSaderaDetails.getDescription());
        existingDoc.setIsHifziya(hifziyaWaradaSaderaDetails.getIsHifziya());
        
        // Update other fields if they exist
        if (hifziyaWaradaSaderaDetails.getNo() != null) {
            existingDoc.setNo(hifziyaWaradaSaderaDetails.getNo());
        }
        if (hifziyaWaradaSaderaDetails.getOrg() != null) {
            existingDoc.setOrg(hifziyaWaradaSaderaDetails.getOrg());
        }

        // ---- File Updates ----
        if (fileURL != null && fileURL.length > 0) {
            // Remove existing files
            if (existingDoc.getFiles() != null && !existingDoc.getFiles().isEmpty()) {
                // Create a copy to avoid ConcurrentModificationException
                List<FileEntity> filesToDelete = new ArrayList<>(existingDoc.getFiles());
                
                for (FileEntity oldFile : filesToDelete) {
                    try {
                        // Delete from database first
                        fileRepository.delete(oldFile);
                        // Then try to delete from disk
                        fileService.deleteFile(oldFile.getFilePath());
                    } catch (Exception e) {
                        logger.warn("Could not delete file: {}", oldFile.getFilePath(), e);
                    }
                }
                existingDoc.getFiles().clear();
            }

            // Save new uploaded files
            try {
                fileService.savefiles(fileURL, existingDoc);
                
                // Refresh the entity to get the new files
                existingDoc = hifziyaWaradaSaderaRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Failed to refresh entity after file upload"));
            } catch (Exception e) {
                logger.error("Failed to upload new files", e);
                throw new RuntimeException("Failed to upload new files: " + e.getMessage(), e);
            }
        }

        HifziyaWaradaSadera updated = hifziyaWaradaSaderaRepository.save(existingDoc);

       auditLogHelper.logUpdate(TABLE_NAME, existingDoc.getId().longValue(), existingDoc.getDescription());


        return updated;
    }

    public void deleteHifziyaWaradaSadera(Integer id) {
        HifziyaWaradaSadera existingDoc = hifziyaWaradaSaderaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("hifziyaWaradaSadera not found with id: " + id));

                      auditLogHelper.logDelete(TABLE_NAME, id.longValue(), existingDoc.getDescription());

        
        hifziyaWaradaSaderaRepository.delete(existingDoc);
    }
}