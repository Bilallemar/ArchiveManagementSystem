package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.dtos.SawanihSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.SawanihRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

import jakarta.transaction.Transactional;

@Service
public class SawanihService {

    private final SawanihRepository sawanihRepository;
    private final FileService fileService;
    private final FileRepository fileRepository;
    private final AuditLogHelper auditLogHelper;
    private static final String TABLE_NAME = "sawanih";

    public SawanihService(
            SawanihRepository sawanihRepository,
            FileService fileService,
            FileRepository fileRepository,
            AuditLogHelper auditLogHelper) {
        this.sawanihRepository = sawanihRepository;
        this.fileService = fileService;
        this.fileRepository = fileRepository;
        this.auditLogHelper = auditLogHelper;
    }

    public Page<SawanihSummaryDTO> getAllSawanihs(
            Long managementId,
            Boolean isSawanih,
            String field,
            String term,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        String cleanTerm = (term == null) ? "" : term.trim();

        Page<Sawanih> raw = sawanihRepository.searchSawanihRepository(
                managementId, isSawanih, field, cleanTerm, pageable);

        return raw.map(s -> new SawanihSummaryDTO(
                s.getId(),
                s.getName(),
                s.getFatherName(),
                s.getIncommingDate(),
                s.getOrg() != null ? s.getOrg().getName() : null,
                s.getIsSawanih()));
    }

    public Optional<Sawanih> getSawanihById(Integer id) {
        return sawanihRepository.findById(id);
    }

    public Sawanih createSawanih(Sawanih sawanih, MultipartFile[] fileURL) {
        System.out.println("Saving Sawanih: " + sawanih);

        // Save the main entity first
        sawanih = sawanihRepository.save(sawanih);

        // If files exist, save them
        if (fileURL != null && fileURL.length > 0) {
            System.out.println("Saving " + fileURL.length + " files");

            // Save all files using fileService
            List<String> storedPaths = fileService.savefiles(fileURL, sawanih);

            // Create FileEntity for each uploaded file
            List<FileEntity> fileEntities = new ArrayList<>();
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];
                FileEntity fileEntity = new FileEntity();
                fileEntity.setFilePath(storedPaths.get(i));
                fileEntity.setFileName(file.getOriginalFilename());
                fileEntity.setFileType(file.getContentType());
                fileEntity.setSawanih(sawanih);
                fileRepository.save(fileEntity);
                fileEntities.add(fileEntity);

                System.out.println("Saved file " + (i + 1) + ": " + file.getOriginalFilename());
            }

            sawanih.setFiles(fileEntities);
        } else {
            System.out.println("No files to save in Service");
        }

        auditLogHelper.logCreate(TABLE_NAME, sawanih.getId().longValue(),
                sawanih.getDescription());
        return sawanih;
    }

    @Transactional
    public Sawanih updateSawanih(Integer id, Sawanih sawanihDetails, MultipartFile[] fileURL) {
        Sawanih existingSawanih = sawanihRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sawanih not found with id: " + id));

        existingSawanih.setName(sawanihDetails.getName());
        existingSawanih.setFatherName(sawanihDetails.getFatherName());
        existingSawanih.setIncommingDate(sawanihDetails.getIncommingDate());
        existingSawanih.setOutgoingDate(sawanihDetails.getOutgoingDate());
        existingSawanih.setOrg(sawanihDetails.getOrg());
        existingSawanih.setPageQuantity(sawanihDetails.getPageQuantity());
        existingSawanih.setDescription(sawanihDetails.getDescription());

        // Update or add files if provided
        if (fileURL != null && fileURL.length > 0) {
            System.out.println("📁 Updating files for record ID: " + id);

            // Delete old files from database and disk
            if (existingSawanih.getFiles() != null && !existingSawanih.getFiles().isEmpty()) {
                System.out.println("🗑️ Removing " + existingSawanih.getFiles().size() + " old files");

                List<FileEntity> filesToDelete = new ArrayList<>(existingSawanih.getFiles());

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

                existingSawanih.getFiles().clear();
            }

            // Save new files
            System.out.println("💾 Saving " + fileURL.length + " new files");
            List<String> storedPaths = fileService.savefiles(fileURL, existingSawanih);

            List<FileEntity> newAttachments = new ArrayList<>();
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile f = fileURL[i];
                FileEntity fe = new FileEntity();
                fe.setFilePath(storedPaths.get(i));
                fe.setFileName(f.getOriginalFilename());
                fe.setFileType(f.getContentType());
                fe.setSawanih(existingSawanih);
                fileRepository.save(fe);
                newAttachments.add(fe);
                System.out.println("✅ Saved new file " + (i + 1) + ": " + f.getOriginalFilename());
            }

            if (existingSawanih.getFiles() == null) {
                existingSawanih.setFiles(new ArrayList<>());
            }
            existingSawanih.getFiles().clear();
            existingSawanih.getFiles().addAll(newAttachments);
        }

        auditLogHelper.logUpdate(TABLE_NAME, existingSawanih.getId().longValue(), existingSawanih.getDescription());

        return sawanihRepository.save(existingSawanih);
    }

    public void deleteSawanih(Integer id) {
        Sawanih sawanih = sawanihRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sawanih not found with id: " + id));

        // Delete associated files
        if (sawanih.getFiles() != null) {
            for (FileEntity file : sawanih.getFiles()) {
                fileService.deleteFile(file.getFilePath());
            }
        }

        auditLogHelper.logDelete(TABLE_NAME, id.longValue(), sawanih.getDescription());

        sawanihRepository.delete(sawanih);
    }
}