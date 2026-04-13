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

import com.MCIT.ArchiveManagementSystem.dtos.HifziyaHazariDTO;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaHazariRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

import jakarta.transaction.Transactional;

@Service
public class HifziyaHazariService {
    private final HifziyaHazariRepository hifziyaHazariRepository;
    private final FileService fileService;
    private final FileRepository fileRepository;
    private static final String TABLE_NAME = "hifziya_hazari";
    private final AuditLogHelper auditLogHelper;
    @Value("${scanner.folder.path:C:/ScannerOutput}")
    private String scannerFolderPath;

    @Value("${spring.file.directory:C:/uploads}")
    private String uploadDir;

    private static final Logger logger = LoggerFactory.getLogger(HifziyaWaradaSaderaService.class);

    public HifziyaHazariService(HifziyaHazariRepository hifziyaHazariRepository,
            FileService fileService,
            FileRepository fileRepository, AuditLogHelper auditLogHelper) {
        this.hifziyaHazariRepository = hifziyaHazariRepository;
        this.fileService = fileService;
        this.fileRepository = fileRepository;
        this.auditLogHelper = auditLogHelper;
    }

    public Page<HifziyaHazariDTO> getHifziyaHazaris(
            Long managementId,
            Boolean isIndraj,
            String field,
            String term,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        String cleanTerm = (term == null) ? "" : term.trim();

        Page<HifziyaHazari> raw = hifziyaHazariRepository.searchHifziyaHazari(
                managementId, isIndraj, field, cleanTerm, pageable);

        return raw.map(h -> new HifziyaHazariDTO(
                h.getId(),
                h.getVolume(),
                h.getYear(),
                h.getType() != null ? h.getType().getName() : null,
                h.getSubType() != null ? h.getSubType().getName() : null,
                h.getOrg() != null ? h.getOrg().getName() : null,
                h.getIsIndraj()));
    }

    public Optional<HifziyaHazari> getHifziyaHazariById(Integer id) {
        return hifziyaHazariRepository.findById(id);
    }

    // ✅ UPDATED: Now accepts multiple files
    public HifziyaHazari createHifziyaHazari(HifziyaHazari hifziyaHazari, MultipartFile[] fileURL,
            List<String> scannerFiles) {
        System.out.println("🔍 scannerFiles received: " + scannerFiles);
        System.out.println("🔍 scannerFolderPath: " + scannerFolderPath);
        System.out.println("🔍 uploadDir: " + uploadDir);

        // Save the main entity first
        hifziyaHazari = hifziyaHazariRepository.save(hifziyaHazari);

        List<FileEntity> fileEntities = new ArrayList<>(); // ← OUTSIDE everything

        // Block 1: Handle manually uploaded files
        if (fileURL != null && fileURL.length > 0) {
            System.out.println("Saving " + fileURL.length + " uploaded files");
            List<String> storedPaths = fileService.savefiles(fileURL, hifziyaHazari);
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];
                FileEntity fe = new FileEntity();
                fe.setFilePath(storedPaths.get(i));
                fe.setFileName(file.getOriginalFilename());
                fe.setFileType(file.getContentType());
                fe.setHifziyaHazari(hifziyaHazari);
                fileRepository.save(fe);
                fileEntities.add(fe);
                System.out.println("✅ Saved uploaded file: " + file.getOriginalFilename());
            }
        } // ← Block 1 ends here

        // Block 2: Handle scanner files — OUTSIDE Block 1
        if (scannerFiles != null && !scannerFiles.isEmpty()) {
            System.out.println("📁 Processing " + scannerFiles.size() + " scanner files");
            for (String name : scannerFiles) {
                try {
                    Path src = Paths.get(scannerFolderPath).resolve(name).normalize();
                    System.out.println("🔍 Looking for: " + src.toAbsolutePath());
                    if (!Files.exists(src)) {
                        System.err.println("❌ Not found: " + src.toAbsolutePath());
                        continue;
                    }
                    String uuid = UUID.randomUUID().toString();
                    String newName = uuid + "_" + name;
                    Path dest = Paths.get(uploadDir).resolve(newName).normalize();
                    // Files.move(src, dest, StandardCopyOption.REPLACE_EXISTING);
                    Files.copy(src, dest, StandardCopyOption.REPLACE_EXISTING);

                    FileEntity fe = new FileEntity();
                    fe.setFileName(name);
                    fe.setFilePath(newName);
                    fe.setFileType(name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream");
                    fe.setHifziyaHazari(hifziyaHazari);
                    fileRepository.save(fe);
                    fileEntities.add(fe);
                    System.out.println("✅ Moved scanner file: " + name + " → " + newName);
                } catch (Exception e) {
                    System.err.println("❌ Failed to move: " + name + " → " + e.getMessage());
                }
            }
        } // ← Block 2 ends here

        // OUTSIDE both blocks
        hifziyaHazari.setFiles(fileEntities);

        auditLogHelper.logCreate(TABLE_NAME, hifziyaHazari.getId().longValue(),
                hifziyaHazari.getDescription());
        return hifziyaHazari;
    }

    @Transactional
    public HifziyaHazari updateHifziyaHazari(Integer id, HifziyaHazari hifziyaHazariDetails, MultipartFile[] fileURL,
            List<String> scannerFiles) {
        HifziyaHazari existingDoc = hifziyaHazariRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HifziyaHazari not found with id: " + id));
        existingDoc.setVolume(hifziyaHazariDetails.getVolume());

        existingDoc.setType(hifziyaHazariDetails.getType());
        existingDoc.setSubType(hifziyaHazariDetails.getSubType());
        existingDoc.setYear(hifziyaHazariDetails.getYear());
        existingDoc.setOrg(hifziyaHazariDetails.getOrg());
        existingDoc.setDescription(hifziyaHazariDetails.getDescription());
        existingDoc.setIsIndraj(hifziyaHazariDetails.getIsIndraj());
        existingDoc.setCabinetFile(hifziyaHazariDetails.getCabinetFile());

        // Update or add files if provided
        boolean hasNewFiles = (fileURL != null && fileURL.length > 0);
        boolean hasScannerFiles = (scannerFiles != null && !scannerFiles.isEmpty());

        if (hasNewFiles || hasScannerFiles) {
            // ✅ Delete old files from disk and DB
            if (existingDoc.getFiles() != null && !existingDoc.getFiles().isEmpty()) {
                for (FileEntity oldFile : existingDoc.getFiles()) {
                        fileService.deleteFile(oldFile.getFilePath());
                    logger.info("Deleted old file: {}", oldFile.getFileName());
                    }
                existingDoc.getFiles().clear();
                fileRepository.flush(); // ✅ make sure deletes happen before inserts
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
                fe.setHifziyaHazari(existingDoc);
                fileRepository.save(fe);
                existingDoc.getFiles().add(fe);
                System.out.println("✅ Manual file saved on update: " + file.getOriginalFilename());
            }
        }

        // ── Handle scanner files ───────────────────────────────
        if (hasScannerFiles) {
            for (String scannerFileName : scannerFiles) {
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
                    fe.setHifziyaHazari(existingDoc);
                    fileRepository.save(fe);
                    existingDoc.getFiles().add(fe);
                    System.out.println("✅ Scanner file on update: " + scannerFileName);

                } catch (java.io.IOException e) {
                    System.err.println("❌ Scanner file failed: " + scannerFileName + " - " + e.getMessage());
        }
            }
        }

        HifziyaHazari updated = hifziyaHazariRepository.save(existingDoc);
        auditLogHelper.logUpdate(TABLE_NAME, existingDoc.getId().longValue(),
                existingDoc.getDescription());
        return updated;
    }

    public void deleteHifziyaHazari(Integer id) {
        HifziyaHazari hifziyaHazari = hifziyaHazariRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HifziyaHazari not found with id: " + id));

        // Delete associated files
        if (hifziyaHazari.getFiles() != null) {
            for (FileEntity file : hifziyaHazari.getFiles()) {
                fileService.deleteFile(file.getFilePath());
            }
        }
        auditLogHelper.logDelete(TABLE_NAME, id.longValue(), hifziyaHazari.getDescription());

        hifziyaHazariRepository.delete(hifziyaHazari);
    }
}