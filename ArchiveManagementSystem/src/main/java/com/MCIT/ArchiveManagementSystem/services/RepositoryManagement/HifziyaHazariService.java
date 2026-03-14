package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    public HifziyaHazari updateHifziyaHazari(Integer id, HifziyaHazari hifziyaHazariDetails, MultipartFile[] fileURL) {
        HifziyaHazari existingDoc = hifziyaHazariRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HifziyaHazari not found with id: " + id));
        existingDoc.setVolume(hifziyaHazariDetails.getVolume());

        existingDoc.setType(hifziyaHazariDetails.getType());
        existingDoc.setSubType(hifziyaHazariDetails.getSubType());
        existingDoc.setYear(hifziyaHazariDetails.getYear());
        existingDoc.setOrg(hifziyaHazariDetails.getOrg());
        existingDoc.setDescription(hifziyaHazariDetails.getDescription());
        existingDoc.setIsIndraj(hifziyaHazariDetails.getIsIndraj());

        // Update or add files if provided
        if (fileURL != null && fileURL.length > 0) {
            System.out.println("📁 Updating files for record ID: " + id);

            // Delete old files from database and disk
            if (existingDoc.getFiles() != null && !existingDoc.getFiles().isEmpty()) {
                System.out.println("🗑️ Removing " + existingDoc.getFiles().size() + " old files");

                List<FileEntity> filesToDelete = new ArrayList<>(existingDoc.getFiles());

                for (FileEntity oldFile : filesToDelete) {
                    try {
                        System.out.println("Deleting file: " + oldFile.getFilePath());
                        fileService.deleteFile(oldFile.getFilePath());
                        fileRepository.delete(oldFile);
                    } catch (Exception e) {
                        // Log but don't stop the process if file doesn't exist
                        System.err.println("⚠️ Could not delete file " + oldFile.getFilePath() + ": " + e.getMessage());
                    }
                }

                existingDoc.getFiles().clear();
            }

            // Save new files
            System.out.println("💾 Saving " + fileURL.length + " new files");
            List<String> storedPaths = fileService.savefiles(fileURL, existingDoc);

            List<FileEntity> newAttachments = new ArrayList<>();
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile f = fileURL[i];
                FileEntity fe = new FileEntity();
                fe.setFilePath(storedPaths.get(i));
                fe.setFileName(f.getOriginalFilename());
                fe.setFileType(f.getContentType());
                fe.setHifziyaHazari(existingDoc);
                fileRepository.save(fe);
                newAttachments.add(fe);
                System.out.println("✅ Saved new file " + (i + 1) + ": " + f.getOriginalFilename());
            }

            if (existingDoc.getFiles() == null) {
                existingDoc.setFiles(new ArrayList<>());
            }
            existingDoc.getFiles().clear();
            existingDoc.getFiles().addAll(newAttachments);
        }
        auditLogHelper.logUpdate(TABLE_NAME, existingDoc.getId().longValue(), existingDoc.getDescription());

        return hifziyaHazariRepository.save(existingDoc);
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