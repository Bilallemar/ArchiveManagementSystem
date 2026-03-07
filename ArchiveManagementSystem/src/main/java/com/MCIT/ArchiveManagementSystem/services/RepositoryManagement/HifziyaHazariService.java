package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    public HifziyaHazari createHifziyaHazari(HifziyaHazari hifziyaHazari, MultipartFile[] fileURL) {
        System.out.println("Saving HifziyaHazari: " + hifziyaHazari);

        // Save the main entity first
        hifziyaHazari = hifziyaHazariRepository.save(hifziyaHazari);

        // If files exist, save them
        if (fileURL != null && fileURL.length > 0) {
            System.out.println("Saving " + fileURL.length + " files");

            // Save all files using fileService
            List<String> storedPaths = fileService.savefiles(fileURL, hifziyaHazari);

            // Create FileEntity for each uploaded file
            List<FileEntity> fileEntities = new ArrayList<>();
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];
                FileEntity fileEntity = new FileEntity();
                fileEntity.setFilePath(storedPaths.get(i));
                fileEntity.setFileName(file.getOriginalFilename());
                fileEntity.setFileType(file.getContentType());
                fileEntity.setHifziyaHazari(hifziyaHazari);
                fileRepository.save(fileEntity);
                fileEntities.add(fileEntity);

                System.out.println("Saved file " + (i + 1) + ": " + file.getOriginalFilename());
            }

            hifziyaHazari.setFiles(fileEntities);
        } else {
            System.out.println("No files to save in Service");
        }
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