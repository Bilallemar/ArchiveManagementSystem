package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakhzanWaradaSadera;
import com.MCIT.ArchiveManagementSystem.repositories.AuditLogRepository;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakhzanWaradaSaderaRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

import jakarta.transaction.Transactional;

@Service
public class MakhzanWaradaSaderaService {

    private static final Logger logger = LoggerFactory.getLogger(MakhzanWaradaSaderaService.class);
    private static final String TABLE_NAME = "MakhzanWaradaSadera";

    private final MakhzanWaradaSaderaRepository repository;
    private final FileRepository fileRepository;
    private final FileService fileService;
    private final AuditLogHelper auditLogHelper;

    public MakhzanWaradaSaderaService(
            MakhzanWaradaSaderaRepository repository,
            FileRepository fileRepository,
            FileService fileService,
            AuditLogRepository auditLogRepository,
            AuditLogHelper auditLogHelper) {

        this.repository = repository;
        this.fileRepository = fileRepository;
        this.fileService = fileService;
        this.auditLogHelper = auditLogHelper;
    }

    public List<MakhzanWaradaSadera> getAll() {
        return repository.findAll();
    }

    public Optional<MakhzanWaradaSadera> getById(Integer id) {
        return repository.findById(id);
    }

    @Transactional
    public MakhzanWaradaSadera create(MakhzanWaradaSadera entity, MultipartFile[] fileURL) {

        entity = repository.save(entity);

        if (fileURL != null && fileURL.length > 0) {
            List<String> storedPaths = fileService.savefiles(fileURL, entity);

            List<FileEntity> files = new ArrayList<>();
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];

                FileEntity fe = new FileEntity();
                fe.setFileName(file.getOriginalFilename());
                fe.setFileType(file.getContentType());
                fe.setFilePath(storedPaths.get(i));
                fe.setMakhzanWaradaSadera(entity);

                fileRepository.save(fe);
                files.add(fe);
            }
            entity.setFiles(files);
        }

        auditLogHelper.logCreate(TABLE_NAME, entity.getId().longValue(), entity.getDescription());
        return entity;
    }

    // @Transactional
    // public MakhzanWaradaSadera update(Integer id, MakhzanWaradaSadera details,
    // MultipartFile[] fileURL) {

    // MakhzanWaradaSadera existing = repository.findById(id)
    // .orElseThrow(() -> new RuntimeException("MakhzanWaradaSadera not found with
    // id: " + id));

    // existing.setNo(details.getNo());
    // existing.setOrg(details.getOrg());
    // existing.setLetterNumber(details.getLetterNumber());
    // existing.setIncommingDate(details.getIncommingDate());
    // existing.setOutgoingDate(details.getOutgoingDate());
    // existing.setSubjectType(details.getSubjectType());
    // existing.setSummary(details.getSummary());
    // existing.setDescription(details.getDescription());
    // existing.setDirection(details.getDirection());

    // if (fileURL != null && fileURL.length > 0) {

    // if (existing.getFiles() != null) {
    // for (FileEntity old : new ArrayList<>(existing.getFiles())) {
    // try {
    // fileRepository.delete(old);
    // fileService.deleteFile(old.getFilePath());
    // } catch (Exception e) {
    // logger.warn("File delete failed: {}", old.getFilePath(), e);
    // }
    // }
    // existing.getFiles().clear();
    // }

    // fileService.savefiles(fileURL, existing);
    // existing = repository.findById(id).orElseThrow();
    // }

    // MakhzanWaradaSadera updated = repository.save(existing);
    // auditLogHelper.logUpdate(TABLE_NAME, updated.getId().longValue(),
    // updated.getDescription());

    // return updated;
    // }
    @Transactional
    public MakhzanWaradaSadera updateMakhzanWaradaSadera(Integer id,
            MakhzanWaradaSadera makhzanWaradaSaderaDetails,
            MultipartFile[] fileURL) {

        MakhzanWaradaSadera existingDoc = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("MakhzanWaradaSadera not found with id: " + id));

        logger.info("Updating MakhzanWaradaSadera id: {}", id);

        // Update basic fields existing.setNo(details.getNo());
        existingDoc.setNo(makhzanWaradaSaderaDetails.getNo());
        existingDoc.setOrg(makhzanWaradaSaderaDetails.getOrg());

        existingDoc.setLetterNumber(makhzanWaradaSaderaDetails.getLetterNumber());
        existingDoc.setIncommingDate(makhzanWaradaSaderaDetails.getIncommingDate());
        existingDoc.setOutgoingDate(makhzanWaradaSaderaDetails.getOutgoingDate());
        existingDoc.setSummary(makhzanWaradaSaderaDetails.getSummary());
        existingDoc.setSubjectType(makhzanWaradaSaderaDetails.getSubjectType());
        existingDoc.setDescription(makhzanWaradaSaderaDetails.getDescription());
        existingDoc.setDirection(makhzanWaradaSaderaDetails.getDirection());

        if (makhzanWaradaSaderaDetails.getNo() != null) {
            existingDoc.setNo(makhzanWaradaSaderaDetails.getNo());
        }
        if (makhzanWaradaSaderaDetails.getOrg() != null) {
            existingDoc.setOrg(makhzanWaradaSaderaDetails.getOrg());
        }

        // Handle file uploads (replace mode by default)
        handleFileUploads(fileURL, existingDoc);

        // Save updated entity
        MakhzanWaradaSadera updated = repository.save(existingDoc);

        auditLogHelper.logUpdate(TABLE_NAME, existingDoc.getId().longValue(), existingDoc.getDescription());

        logger.info("Update completed for id: {}", id);
        return updated;
    }

    /**
     * Common method for handling file uploads (used by both create and update)
     */
    private void handleFileUploads(MultipartFile[] fileURL, MakhzanWaradaSadera entity) {
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
            fileEntity.setMakhzanWaradaSadera(entity);

            fileEntity = fileRepository.save(fileEntity);
            entity.getFiles().add(fileEntity);

            logger.info("Added new file: {} (original: {})", safeName, originalName);
        }
    }

    public void delete(Integer id) {

        MakhzanWaradaSadera entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("MakhzanWaradaSadera not found with id: " + id));

        auditLogHelper.logDelete(TABLE_NAME, id.longValue(), entity.getDescription());
        repository.delete(entity);
    }
}
