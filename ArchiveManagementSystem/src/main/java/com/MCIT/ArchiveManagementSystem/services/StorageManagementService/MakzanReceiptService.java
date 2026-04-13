package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;

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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.dtos.MakzanReceiptSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
import com.MCIT.ArchiveManagementSystem.repositories.AuditLogRepository;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.HifziyaWaradaSaderaService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

import jakarta.transaction.Transactional;

@Service
public class MakzanReceiptService {

    @Value("${spring.file.directory}") // ✅ add this
    private String uploadDir;

    @Value("${scanner.folder.path}") // ✅ add this
    private String scannerFolderPath;

    private static final String TABLE_NAME = "makzan_receipt";
    private final AuditLogHelper auditLogHelper;

    private static final Logger logger = LoggerFactory.getLogger(HifziyaWaradaSaderaService.class);

    private final MakzanReceiptRepository makzanReceiptRepository;
    private final FileService fileService;
    private final FileRepository fileRepository;
    private final AuditLogRepository auditLogRepository;

    public MakzanReceiptService(MakzanReceiptRepository makzanReceiptRepository, FileService fileService,
            FileRepository fileRepository, AuditLogRepository auditLogRepository, AuditLogHelper auditLogHelper) {
        this.makzanReceiptRepository = makzanReceiptRepository;
        this.fileService = fileService;
        this.fileRepository = fileRepository;
        this.auditLogRepository = auditLogRepository;
        this.auditLogHelper = auditLogHelper;

    }

    private String sanitizeFileName(String originalName) {
        if (originalName == null) {
            return "file_" + System.currentTimeMillis();
        }
        String sanitized = originalName.replaceAll("[^\\p{ASCII}]", "_");
        logger.info("Filename sanitized: '{}' → '{}'", originalName, sanitized);
        return sanitized;
    }

    private String getCurrentUsername() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                return auth.getName();
            }
        } catch (Exception e) {
            logger.warn("Could not get authenticated username: {}", e.getMessage());
        }
        return "system";
    }

    public Page<MakzanReceiptSummaryDTO> getAll(
            Management management,
            String field,
            String term,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        String cleanTerm = (term == null) ? "" : term.trim();

        Page<MakzanReceipt> raw = makzanReceiptRepository.searchMakzanReceipt(
                management, field, cleanTerm, pageable);

        return raw.map(m -> new MakzanReceiptSummaryDTO(
                m.getId(),
                m.getDocNo(),
                m.getDepartment(),
                m.getOrg() != null ? m.getOrg().getName() : null,
                m.getLetterNo(),
                m.getSubjectType()));
    }

    public Optional<MakzanReceipt> getReceiptById(Integer id) {
        return makzanReceiptRepository.findById(id);
    }

    @Transactional
    public MakzanReceipt createReceipt(MakzanReceipt makzanReceipts, MultipartFile[] fileURL,
            List<String> scannerFileNames) {
        makzanReceipts = makzanReceiptRepository.save(makzanReceipts);

        System.out.println("Saving MakzanReceipt: " + makzanReceipts);
        // Save the main entity first (without files)
        List<FileEntity> fileEntities = new ArrayList<>();

        if (fileURL != null && fileURL.length > 0) {
            System.out.println("Saving " + fileURL.length + " files");

            // Save all files using fileService
            List<String> storedPaths = fileService.savefiles(fileURL, makzanReceipts);

            // Create FileEntity for each uploaded file
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];
                FileEntity fileEntity = new FileEntity();
                fileEntity.setFilePath(storedPaths.get(i));
                fileEntity.setFileName(file.getOriginalFilename());
                fileEntity.setFileType(file.getContentType());
                fileEntity.setMakzanReceipt(makzanReceipts);
                fileRepository.save(fileEntity);
                fileEntities.add(fileEntity);

                System.out.println("Saved file " + (i + 1) + ": " + file.getOriginalFilename());
            }

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
                        fe.setMakzanReceipt(makzanReceipts);
                        fileRepository.save(fe);
                        fileEntities.add(fe);
                        System.out.println("✅ Scanner file copied: " + scannerFileName);

                    } catch (java.io.IOException e) { // ✅ fully qualified to be safe
                        System.err.println("❌ Failed to copy scanner file: "
                                + scannerFileName + " - " + e.getMessage());
                    }
                }
            }

            makzanReceipts.setFiles(fileEntities);

        }

        auditLogHelper.logCreate(TABLE_NAME, makzanReceipts.getId().longValue(),
                makzanReceipts.getDescription());
        return makzanReceipts;
    }

    @Transactional
    public MakzanReceipt updateReceipt(
            Integer id,
            MakzanReceipt makzanReceiptDetails,
            MultipartFile[] fileURL,
            List<String> scannerFileNames) {

        MakzanReceipt makzanReceipts = makzanReceiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MakzanReceipt not found with id: " + id));

        // Update fields
        makzanReceipts.setDocNo(makzanReceiptDetails.getDocNo());
        makzanReceipts.setOrg(makzanReceiptDetails.getOrg());

        makzanReceipts.setDepartment(makzanReceiptDetails.getDepartment());
        makzanReceipts.setLetterNo(makzanReceiptDetails.getLetterNo());
        makzanReceipts.setLetterDate(makzanReceiptDetails.getLetterDate());
        makzanReceipts.setSubjectType(makzanReceiptDetails.getSubjectType());
        makzanReceipts.setDescription(makzanReceiptDetails.getDescription());
        makzanReceipts.setCabinetFile(makzanReceipts.getCabinetFile());

        logger.info("Updating MakzanReceipt id: {}", id);

        boolean hasNewFiles = (fileURL != null && fileURL.length > 0);
        boolean hasScannerFiles = (scannerFileNames != null && !scannerFileNames.isEmpty());

        if (hasNewFiles || hasScannerFiles) {
            // ✅ Delete old files from disk and DB
            if (makzanReceipts.getFiles() != null && !makzanReceipts.getFiles().isEmpty()) {
                for (FileEntity oldFile : makzanReceipts.getFiles()) {
                        fileService.deleteFile(oldFile.getFilePath());
                    logger.info("Deleted old file: {}", oldFile.getFileName());
                }
                makzanReceipts.getFiles().clear();
                fileRepository.flush(); // ✅ make sure deletes happen before inserts
            }
        }

        // ── Handle manual uploaded files ──────────────────────
        if (hasNewFiles) {
            List<String> storedPaths = fileService.savefiles(fileURL, makzanReceipts);
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];
                if (file == null || file.isEmpty())
                    continue;

                FileEntity fe = new FileEntity();
                fe.setFilePath(storedPaths.get(i));
                fe.setFileName(file.getOriginalFilename()); // ✅ keep original name
                fe.setFileType(file.getContentType());
                fe.setFileSize(file.getSize());
                fe.setMakzanReceipt(makzanReceipts);
                fileRepository.save(fe);
                makzanReceipts.getFiles().add(fe);
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
                    fe.setMakzanReceipt(makzanReceipts);
                    fileRepository.save(fe);
                    makzanReceipts.getFiles().add(fe);
                    System.out.println("✅ Scanner file on update: " + scannerFileName);

                } catch (java.io.IOException e) {
                    System.err.println("❌ Scanner file failed: " + scannerFileName + " - "
                            + e.getMessage());
            }
        }
        }

        MakzanReceipt updated = makzanReceiptRepository.save(makzanReceipts);
        auditLogHelper.logUpdate(TABLE_NAME, makzanReceipts.getId().longValue(),
                makzanReceipts.getDescription());
        return updated;
    }

    public void deleteReceipt(Integer id) {
        MakzanReceipt makzanReceipts = makzanReceiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

        auditLogHelper.logDelete(TABLE_NAME, id.longValue(), makzanReceipts.getDescription());

        makzanReceiptRepository.delete(makzanReceipts);
    }


}