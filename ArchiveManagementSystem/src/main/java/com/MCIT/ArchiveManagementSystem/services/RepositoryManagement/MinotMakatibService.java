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

import com.MCIT.ArchiveManagementSystem.dtos.MinotMakatibSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.MinotMakatib;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.MinotMakatibRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

import jakarta.transaction.Transactional;

@Service
public class MinotMakatibService {
    @Value("${spring.file.directory}") // ✅ add this
    private String uploadDir;

    @Value("${scanner.folder.path}") // ✅ add this
    private String scannerFolderPath;
    private static final Logger logger = LoggerFactory.getLogger(HifziyaWaradaSaderaService.class);

    private final MinotMakatibRepository minotMakatibRepository;
    private final FileService fileService;
    private final FileRepository fileRepository;
    private final AuditLogHelper auditLogHelper;
    private static final String TABLE_NAME = "sawanih";

    public MinotMakatibService(
            MinotMakatibRepository minotMakatibRepository,
            FileService fileService,
            FileRepository fileRepository,
            AuditLogHelper auditLogHelper) {
        this.minotMakatibRepository = minotMakatibRepository;
        this.fileService = fileService;
        this.fileRepository = fileRepository;
        this.auditLogHelper = auditLogHelper;
    }

    public Page<MinotMakatibSummaryDTO> getAllMinotMakatibs(
            Long managementId,

            String field,
            String term,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        String cleanTerm = (term == null) ? "" : term.trim();

        Page<MinotMakatib> raw = minotMakatibRepository.searchMinotMakatibRepository(
                managementId, field, cleanTerm, pageable);

        return raw.map(m -> new MinotMakatibSummaryDTO(
                m.getId(),
                m.getCartonNumber(),
                m.getLetterNumber(), // ✅ 3rd
                m.getYear(), // ✅ 4th
                m.getSubject(), // ✅ 5th
                m.getOrg() != null ? m.getOrg().getName() : null));
    }

    public Optional<MinotMakatib> getMinotMakatibById(Integer id) {
        return minotMakatibRepository.findById(id);
    }

    // In MinotMakatibService.java
    @Transactional
    public MinotMakatib createMinotMakatib(
            MinotMakatib minotMakatib,
            MultipartFile[] fileURL,
            List<String> scannerFileNames) { // ✅ add this

        minotMakatib = minotMakatibRepository.save(minotMakatib);
        List<FileEntity> fileEntities = new ArrayList<>();

        // Manual files
        if (fileURL != null && fileURL.length > 0) {
            List<String> storedPaths = fileService.savefiles(fileURL, minotMakatib);
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];
                if (file == null || file.isEmpty())
                    continue;
                FileEntity fe = new FileEntity();
                fe.setFilePath(storedPaths.get(i));
                fe.setFileName(file.getOriginalFilename());
                fe.setFileType(file.getContentType());
                fe.setFileSize(file.getSize());
                fe.setMinotMakatib(minotMakatib);
                fileRepository.save(fe);
                fileEntities.add(fe);
            }
        }

        // Scanner files
        if (scannerFileNames != null && !scannerFileNames.isEmpty()) {
            for (String scannerFileName : scannerFileNames) {
                try {
                    Path sourcePath = Paths.get(scannerFolderPath, scannerFileName);
                    String uniqueName = UUID.randomUUID() + "_" + scannerFileName;
                    Path destPath = Paths.get(uploadDir, uniqueName);
                    Files.createDirectories(Paths.get(uploadDir));
                    Files.copy(sourcePath, destPath, StandardCopyOption.REPLACE_EXISTING);

                    FileEntity fe = new FileEntity();
                    fe.setFilePath(uniqueName);
                    fe.setFileName(scannerFileName);
                    fe.setFileType(Files.probeContentType(sourcePath));
                    fe.setFileSize(Files.size(sourcePath));
                    fe.setMinotMakatib(minotMakatib);
                    fileRepository.save(fe);
                    fileEntities.add(fe);
                } catch (java.io.IOException e) {
                    System.err.println("Error processing scanner file " + scannerFileName + ": " + e.getMessage());
                }
            }
        }

        minotMakatib.setFiles(fileEntities);
        auditLogHelper.logCreate(TABLE_NAME, minotMakatib.getId().longValue(), minotMakatib.getDescription());
        return minotMakatib;
    }

    @Transactional
    public MinotMakatib updateMinotMakatib(Integer id, MinotMakatib minotMakatibDetails, MultipartFile[] fileURL,
            List<String> scannerFileNames) {
        MinotMakatib existingMinotMakatib = minotMakatibRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MinotMakatib not found with id: " + id));

        existingMinotMakatib.setCartonNumber(minotMakatibDetails.getCartonNumber());
        existingMinotMakatib.setLetterNumber(minotMakatibDetails.getLetterNumber());
        existingMinotMakatib.setYear(minotMakatibDetails.getYear());
        existingMinotMakatib.setOrg(minotMakatibDetails.getOrg());
        existingMinotMakatib.setSubject(minotMakatibDetails.getSubject());
        existingMinotMakatib.setDescription(minotMakatibDetails.getDescription());
        existingMinotMakatib.setCabinetFile(minotMakatibDetails.getCabinetFile());
        boolean hasNewFiles = (fileURL != null && fileURL.length > 0);
        boolean hasScannerFiles = (scannerFileNames != null && !scannerFileNames.isEmpty());
        // Update or add files if provided
        //
        if (hasNewFiles || hasScannerFiles) {
            // ✅ Delete old files from disk and DB
            if (existingMinotMakatib.getFiles() != null && !existingMinotMakatib.getFiles().isEmpty()) {
                for (FileEntity oldFile : existingMinotMakatib.getFiles()) {
                    fileService.deleteFile(oldFile.getFilePath());
                    logger.info("Deleted old file: {}", oldFile.getFileName());
                }
                existingMinotMakatib.getFiles().clear();
                fileRepository.flush(); // ✅ make sure deletes happen before inserts
            }
        }

        // ── Handle manual uploaded files ──────────────────────
        if (hasNewFiles) {
            List<String> storedPaths = fileService.savefiles(fileURL, existingMinotMakatib);
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];
                if (file == null || file.isEmpty())
                    continue;

                FileEntity fe = new FileEntity();
                fe.setFilePath(storedPaths.get(i));
                fe.setFileName(file.getOriginalFilename()); // ✅ keep original name
                fe.setFileType(file.getContentType());
                fe.setFileSize(file.getSize());
                fe.setMinotMakatib(existingMinotMakatib);
                fileRepository.save(fe);
                existingMinotMakatib.getFiles().add(fe);
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
                    fe.setMinotMakatib(existingMinotMakatib);
                    fileRepository.save(fe);
                    existingMinotMakatib.getFiles().add(fe);
                    System.out.println("✅ Scanner file on update: " + scannerFileName);

                } catch (java.io.IOException e) {
                    System.err.println("❌ Scanner file failed: " + scannerFileName + " - " + e.getMessage());
                }
            }
        }

        MinotMakatib updated = minotMakatibRepository.save(existingMinotMakatib);
        auditLogHelper.logUpdate(TABLE_NAME, existingMinotMakatib.getId().longValue(),
                existingMinotMakatib.getDescription());
        return updated;
    }

    public void deleteMinotMakatib(Integer id) {
        MinotMakatib minotMakatib = minotMakatibRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MinotMakatib not found with id: " + id));

        // Delete associated files
        if (minotMakatib.getFiles() != null) {
            for (FileEntity file : minotMakatib.getFiles()) {
                fileService.deleteFile(file.getFilePath());
            }
        }

        auditLogHelper.logDelete(TABLE_NAME, id.longValue(), minotMakatib.getDescription());

        minotMakatibRepository.delete(minotMakatib);
    }
}