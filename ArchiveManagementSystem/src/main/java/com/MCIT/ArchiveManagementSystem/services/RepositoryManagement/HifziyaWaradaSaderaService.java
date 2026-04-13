package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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
    @Value("${spring.file.directory}") // ✅ add this
    private String uploadDir;

    @Value("${scanner.folder.path}") // ✅ add this
    private String scannerFolderPath;
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
    public HifziyaWaradaSadera createHifziyaWaradaSadera(
            HifziyaWaradaSadera hifziyaWaradaSadera,
            MultipartFile[] fileURL,
            List<String> scannerFileNames) { // ✅ new parameter

        hifziyaWaradaSadera = hifziyaWaradaSaderaRepository.save(hifziyaWaradaSadera);
        System.out.println("✅ Saved with ID: " + hifziyaWaradaSadera.getId());

        List<FileEntity> fileEntities = new ArrayList<>();

        // ── Handle manual uploaded files ──────────────────────────
        if (fileURL != null && fileURL.length > 0) {
            List<String> storedPaths = fileService.savefiles(fileURL, hifziyaWaradaSadera);

            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];
                if (file == null || file.isEmpty())
                    continue;

                FileEntity fe = new FileEntity();
                fe.setFilePath(storedPaths.get(i));
                fe.setFileName(file.getOriginalFilename());
                fe.setFileType(file.getContentType());
                fe.setFileSize(file.getSize());
                fe.setHifziyaWaradaSadera(hifziyaWaradaSadera);
                fileRepository.save(fe);
                fileEntities.add(fe);
                System.out.println("✅ Manual file saved: " + file.getOriginalFilename());
            }
        }

        // ── Handle scanner files ───────────────────────────────────
        if (scannerFileNames != null && !scannerFileNames.isEmpty()) {
            for (String scannerFileName : scannerFileNames) {
                try {
                    Path sourcePath = Paths.get(scannerFolderPath, scannerFileName);
                    String uniqueName = UUID.randomUUID() + "_" + scannerFileName;
                    Path destPath = Paths.get(uploadDir, uniqueName);

                    Files.createDirectories(Paths.get(uploadDir));
                    Files.copy(sourcePath, destPath, StandardCopyOption.REPLACE_EXISTING);

                    String fileType = Files.probeContentType(sourcePath);

                    FileEntity fe = new FileEntity();
                    fe.setFilePath(uniqueName);
                    fe.setFileName(scannerFileName);
                    fe.setFileType(fileType != null ? fileType : "application/octet-stream");
                    fe.setFileSize(Files.size(sourcePath));
                    fe.setHifziyaWaradaSadera(hifziyaWaradaSadera);
                    fileRepository.save(fe);
                    fileEntities.add(fe);
                    System.out.println("✅ Scanner file copied: " + scannerFileName);

                } catch (java.io.IOException e) { // ✅ fully qualified to be safe
                    System.err.println("❌ Failed to copy scanner file: "
                            + scannerFileName + " - " + e.getMessage());
                }
            }
        }

        hifziyaWaradaSadera.setFiles(fileEntities);

        auditLogHelper.logCreate(TABLE_NAME,
                hifziyaWaradaSadera.getId().longValue(),
                hifziyaWaradaSadera.getDescription());

        return hifziyaWaradaSadera;
    }

    @Transactional
    public HifziyaWaradaSadera updateHifziyaWaradaSadera(
            Integer id,
            HifziyaWaradaSadera hifziyaWaradaSaderaDetails,
            MultipartFile[] fileURL,
            List<String> scannerFileNames) {

        HifziyaWaradaSadera existingDoc = hifziyaWaradaSaderaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found: " + id));

        // ── Update fields ──────────────────────────────────────
        existingDoc.setNo(hifziyaWaradaSaderaDetails.getNo());
        existingDoc.setOrg(hifziyaWaradaSaderaDetails.getOrg());

        existingDoc.setLetterNumber(hifziyaWaradaSaderaDetails.getLetterNumber());
        existingDoc.setIncommingDate(hifziyaWaradaSaderaDetails.getIncommingDate());
        existingDoc.setOutgoingDate(hifziyaWaradaSaderaDetails.getOutgoingDate());
        existingDoc.setSummary(hifziyaWaradaSaderaDetails.getSummary());
        existingDoc.setSubjectType(hifziyaWaradaSaderaDetails.getSubjectType());
        existingDoc.setDescription(hifziyaWaradaSaderaDetails.getDescription());
        existingDoc.setDirection(hifziyaWaradaSaderaDetails.getDirection());
        existingDoc.setCabinetFile(hifziyaWaradaSaderaDetails.getCabinetFile());

        // ── Only delete old files if NEW files are being uploaded ──
        boolean hasNewFiles = (fileURL != null && fileURL.length > 0);
        boolean hasScannerFiles = (scannerFileNames != null && !scannerFileNames.isEmpty());

        if (hasNewFiles || hasScannerFiles) {
            // ✅ Delete old files from disk and DB
            if (existingDoc.getFiles() != null && !existingDoc.getFiles().isEmpty()) {
                for (FileEntity oldFile : existingDoc.getFiles()) {
                    fileService.deleteFile(oldFile.getFilePath());
                    fileRepository.delete(oldFile);
                }
                existingDoc.getFiles().clear();
                fileRepository.flush();
            }
        }

        // ── Handle manual uploaded files ──────────────────────
        if (hasNewFiles) {
            List<String> storedPaths = fileService.savefiles(fileURL, existingDoc);
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];
                if (file == null || file.isEmpty())
                    continue;

                FileEntity fe = new FileEntity();
                fe.setFilePath(storedPaths.get(i));
                fe.setFileName(file.getOriginalFilename()); // ✅ keep original name
                fe.setFileType(file.getContentType());
                fe.setFileSize(file.getSize());
                fe.setHifziyaWaradaSadera(existingDoc);
                fileRepository.save(fe);
                existingDoc.getFiles().add(fe);
                System.out.println("✅ Manual file saved on update: " + file.getOriginalFilename());
            }
        }
        // ── Handle scanner files ───────────────────────────────
        if (hasScannerFiles) {
            for (String scannerFileName : scannerFileNames) {
                try {
                    Path sourcePath = Paths.get(scannerFolderPath, scannerFileName);
                    String uniqueName = UUID.randomUUID() + "_" + scannerFileName;
                    Path destPath = Paths.get(uploadDir, uniqueName);

                    Files.createDirectories(Paths.get(uploadDir));
                    Files.copy(sourcePath, destPath, StandardCopyOption.REPLACE_EXISTING);

                    String fileType = Files.probeContentType(sourcePath);

                    FileEntity fe = new FileEntity();
                    fe.setFilePath(uniqueName);
                    fe.setFileName(scannerFileName);
                    fe.setFileType(fileType != null ? fileType : "application/octet-stream");
                    fe.setFileSize(Files.size(sourcePath));
                    fe.setHifziyaWaradaSadera(existingDoc);
                    fileRepository.save(fe);
                    existingDoc.getFiles().add(fe);
                    System.out.println("✅ Scanner file on update: " + scannerFileName);

                } catch (java.io.IOException e) {
                    System.err.println("❌ Scanner file failed: " + scannerFileName + " - " + e.getMessage());
                }
            }
        }

        HifziyaWaradaSadera updatedDoc = hifziyaWaradaSaderaRepository.save(existingDoc);
        auditLogHelper.logUpdate(TABLE_NAME, id.longValue(), existingDoc.getDescription());
        return updatedDoc;
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