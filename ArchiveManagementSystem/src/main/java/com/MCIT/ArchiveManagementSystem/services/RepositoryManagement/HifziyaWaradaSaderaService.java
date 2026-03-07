package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.dtos.HifziyaWaradaSaderaSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.enums.HifziyaWaradaSaderaDirection;
import com.MCIT.ArchiveManagementSystem.repositories.AuditLogRepository;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaWaradaSaderaRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

import jakarta.transaction.Transactional;

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
            AuditLogRepository auditLogRepository,
            AuditLogHelper auditLogHelper) {
        this.hifziyaWaradaSaderaRepository = hifziyaWaradaSaderaRepository;
        this.fileRepository = fileRepository;
        this.fileService = fileService;
        this.auditLogRepository = auditLogRepository;
        this.auditLogHelper = auditLogHelper;
    }

    public Page<HifziyaWaradaSaderaSummaryDTO> getAllHifziyaWaradaSadera(
            Management management,
            String direction,
            String field,
            String term,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        String cleanTerm = (term == null) ? "" : term.trim();

        // Convert String → enum
        HifziyaWaradaSaderaDirection directionEnum = null;
        if (direction != null && !direction.isBlank()) {
            directionEnum = HifziyaWaradaSaderaDirection.valueOf(direction.toUpperCase());
        }

        Page<HifziyaWaradaSadera> raw = hifziyaWaradaSaderaRepository.searchHifziyaWaradaSadera(
                management, directionEnum, field, cleanTerm, pageable); // ← directionEnum not cleanDirection

        return raw.map(a -> new HifziyaWaradaSaderaSummaryDTO(
                a.getId(),
                a.getLetterNumber(),
                a.getIncommingDate(),
                a.getSubjectType(),
                a.getOrg() != null ? a.getOrg().getName() : null, // ← senderOrgName
                a.getDirection() != null ? a.getDirection().name() : null));
    }

    // ── DETAIL (full entity, only when user clicks View) ───────────────────
    public Optional<HifziyaWaradaSadera> getArchiveById(Integer id) {
        return hifziyaWaradaSaderaRepository.findById(id);
    }

    public Optional<HifziyaWaradaSadera> getHifziyaWaradaSaderaById(Integer id) {
        return hifziyaWaradaSaderaRepository.findById(id);
    }

    @Transactional
    public HifziyaWaradaSadera createHifziyaWaradaSadera(HifziyaWaradaSadera hifziyaWaradaSadera,
            MultipartFile[] fileURL) {
        logger.info("Creating new HifziyaWaradaSadera: {}", hifziyaWaradaSadera);

        // Save main entity first
        hifziyaWaradaSadera = hifziyaWaradaSaderaRepository.save(hifziyaWaradaSadera);

        handleFileUploads(fileURL, hifziyaWaradaSadera);

        auditLogHelper.logCreate(TABLE_NAME, hifziyaWaradaSadera.getId().longValue(),
                hifziyaWaradaSadera.getDescription());

        return hifziyaWaradaSadera;
    }

    @Transactional
    public HifziyaWaradaSadera updateHifziyaWaradaSadera(Integer id,
            HifziyaWaradaSadera hifziyaWaradaSaderaDetails,
            MultipartFile[] fileURL) {

        HifziyaWaradaSadera existingDoc = hifziyaWaradaSaderaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HifziyaWaradaSadera not found with id: " + id));

        logger.info("Updating HifziyaWaradaSadera id: {}", id);

        // Update basic fields existing.setNo(details.getNo());
        existingDoc.setNo(hifziyaWaradaSaderaDetails.getNo());
        existingDoc.setOrg(hifziyaWaradaSaderaDetails.getOrg());

        existingDoc.setLetterNumber(hifziyaWaradaSaderaDetails.getLetterNumber());
        existingDoc.setIncommingDate(hifziyaWaradaSaderaDetails.getIncommingDate());
        existingDoc.setOutgoingDate(hifziyaWaradaSaderaDetails.getOutgoingDate());
        existingDoc.setSummary(hifziyaWaradaSaderaDetails.getSummary());
        existingDoc.setSubjectType(hifziyaWaradaSaderaDetails.getSubjectType());
        existingDoc.setDescription(hifziyaWaradaSaderaDetails.getDescription());
        existingDoc.setDirection(hifziyaWaradaSaderaDetails.getDirection());

        if (hifziyaWaradaSaderaDetails.getNo() != null) {
            existingDoc.setNo(hifziyaWaradaSaderaDetails.getNo());
        }
        if (hifziyaWaradaSaderaDetails.getOrg() != null) {
            existingDoc.setOrg(hifziyaWaradaSaderaDetails.getOrg());
        }

        // Handle file uploads (replace mode by default)
        handleFileUploads(fileURL, existingDoc);

        // Save updated entity
        HifziyaWaradaSadera updated = hifziyaWaradaSaderaRepository.save(existingDoc);

        auditLogHelper.logUpdate(TABLE_NAME, existingDoc.getId().longValue(), existingDoc.getDescription());

        logger.info("Update completed for id: {}", id);
        return updated;
    }

    /**
     * Common method for handling file uploads (used by both create and update)
     */
    private void handleFileUploads(MultipartFile[] fileURL, HifziyaWaradaSadera entity) {
        if (fileURL == null || fileURL.length == 0) {
            logger.info("No files provided for upload");
            return;
        }

        logger.info("Processing {} file(s) for entity id: {}", fileURL.length, entity.getId());

        // Initialize files list if null
        if (entity.getFiles() == null) {
            entity.setFiles(new ArrayList<>());
        }

        // Replace mode: delete existing files first
        if (!entity.getFiles().isEmpty()) {
            List<FileEntity> filesToDelete = new ArrayList<>(entity.getFiles());
            for (FileEntity oldFile : filesToDelete) {
                try {
                    fileRepository.delete(oldFile);
                    fileService.deleteFile(oldFile.getFilePath());
                    logger.info("Deleted old file: {}", oldFile.getFileName());
                } catch (Exception e) {
                    logger.warn("Failed to delete old file {}: {}", oldFile.getFileName(), e.getMessage());
                }
            }
            entity.getFiles().clear();
        }

        // Save new files to disk
        List<String> storedPaths = fileService.savefiles(fileURL, entity);

        // Create and save new FileEntity records
        for (int i = 0; i < fileURL.length; i++) {
            MultipartFile file = fileURL[i];
            if (file == null || file.isEmpty()) {
                continue;
            }

            // Sanitize filename to prevent Unicode issues in response
            String originalName = file.getOriginalFilename();
            String safeName = originalName != null
                    ? originalName.replaceAll("[^\\p{ASCII}]", "_")
                    : "file_" + System.currentTimeMillis();

            FileEntity fileEntity = new FileEntity();
            fileEntity.setFilePath(storedPaths.get(i));
            fileEntity.setFileName(safeName); // Use sanitized name
            fileEntity.setFileType(file.getContentType());
            fileEntity.setHifziyaWaradaSadera(entity);

            fileEntity = fileRepository.save(fileEntity);
            entity.getFiles().add(fileEntity);

            logger.info("Added new file: {} (original: {})", safeName, originalName);
        }
    }

    public void deleteHifziyaWaradaSadera(Integer id) {
        HifziyaWaradaSadera existingDoc = hifziyaWaradaSaderaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HifziyaWaradaSadera not found with id: " + id));

        logger.info("Deleting HifziyaWaradaSadera id: {}", id);

        // Optional: delete associated files
        if (existingDoc.getFiles() != null) {
            for (FileEntity file : existingDoc.getFiles()) {
                try {
                    fileService.deleteFile(file.getFilePath());
                } catch (Exception e) {
                    logger.warn("Failed to delete file {} during record deletion", file.getFileName(), e);
                }
            }
        }

        auditLogHelper.logDelete(TABLE_NAME, id.longValue(), existingDoc.getDescription());

        hifziyaWaradaSaderaRepository.delete(existingDoc);
    }
}