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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.dtos.MakzanAnnualReportSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanAnnualReport;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanAnnualReportRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

import jakarta.transaction.Transactional;

@Service
public class MakzanAnnualReportService {
        @Value("${spring.file.directory}") // ✅ add this
        private String uploadDir;

        @Value("${scanner.folder.path}") // ✅ add this
        private String scannerFolderPath;
        private static final Logger logger = LoggerFactory.getLogger(MakzanAnnualReportService.class);
        private static final String TABLE_NAME = "makzan_annual_report";

        private final MakzanAnnualReportRepository makzanAnnualReportRepository;
        private final AuditLogHelper auditLogHelper;
        private final FileService fileService;
        private final FileRepository fileRepository;

        public MakzanAnnualReportService(
                        MakzanAnnualReportRepository makzanAnnualReportRepository,
                        AuditLogHelper auditLogHelper,
                        FileService fileService,
                        FileRepository fileRepository) {
                this.makzanAnnualReportRepository = makzanAnnualReportRepository;
                this.auditLogHelper = auditLogHelper;
                this.fileService = fileService;
                this.fileRepository = fileRepository;
        }

        // ─── Helper: sanitize filename (removes Pashto/Arabic chars from HTTP headers)
        // ─
        private String sanitizeFileName(String originalName) {
                if (originalName == null) {
                        return "file_" + System.currentTimeMillis();
                }
                String sanitized = originalName.replaceAll("[^\\p{ASCII}]", "_");
                logger.info("Filename sanitized: '{}' → '{}'", originalName, sanitized);
                return sanitized;
        }

        // ─── GET ALL ────────────────────────────────────────────────────────────────
        // public List<MakzanAnnualReport> gitAllAnnualReports() {
        // return makzanAnnualReportRepository.findAll();
        // }
        public Page<MakzanAnnualReportSummaryDTO> gitAllAnnualReports(
                        Management management,
                        String field,
                        String term,
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size);
                String cleanTerm = (term == null) ? "" : term.trim();

                // Convert String → enum

                Page<MakzanAnnualReport> raw = makzanAnnualReportRepository.searchMakzanAnnualReport(
                                management, field, cleanTerm, pageable); // ← directionEnum not cleanDirection

                return raw.map(a -> new MakzanAnnualReportSummaryDTO(
                                a.getId(),
                                a.getYear(),
                                a.getProvince() != null ? a.getProvince().getName() : null,
                                a.getDistrict() != null ? a.getDistrict().getName() : null));
        }

        // ─── GET BY ID ──────────────────────────────────────────────────────────────
        public Optional<MakzanAnnualReport> getAnnualReportById(Integer id) {
                return makzanAnnualReportRepository.findById(id);
        }

        // ─── CREATE ─────────────────────────────────────────────────────────────────
        @Transactional
        public MakzanAnnualReport createAnnualReport(
                        MakzanAnnualReport annualReport,
                        MultipartFile[] fileURL, List<String> scannerFiles) {

                // 1. Save main entity first
                annualReport = makzanAnnualReportRepository.save(annualReport);
                logger.info("MakzanAnnualReport created with id: {}", annualReport.getId());
                List<FileEntity> fileEntities = new ArrayList<>();

                // 2. Save files
                if (fileURL != null && fileURL.length > 0) {
                        List<String> storedPaths = fileService.savefiles(fileURL, annualReport);

                        for (int i = 0; i < fileURL.length; i++) {
                                MultipartFile file = fileURL[i];
                                if (file == null || file.isEmpty())
                                        continue;

                                String safeName = sanitizeFileName(file.getOriginalFilename());

                                FileEntity fileEntity = new FileEntity();
                                fileEntity.setFilePath(storedPaths.get(i));
                                fileEntity.setFileName(safeName);
                                fileEntity.setFileType(file.getContentType());
                                fileEntity.setMakzanAnnualReport(annualReport);

                                fileEntities.add(fileEntity);
                                logger.info("File queued for save: {}", safeName);
                        }

                        if (scannerFiles != null && !scannerFiles.isEmpty()) {
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
                                                fe.setFileType(fileType != null ? fileType
                                                                : "application/octet-stream");
                                                fe.setFileSize(Files.size(sourcePath));
                                                fe.setMakzanAnnualReport(annualReport);
                                                fileRepository.save(fe);
                                                fileEntities.add(fe);
                                                System.out.println("✅ Scanner file copied: " + scannerFileName);

                                        } catch (java.io.IOException e) { // ✅ fully qualified to be safe
                                                System.err.println("❌ Failed to copy scanner file: "
                                                                + scannerFileName + " - " + e.getMessage());
                                        }
                                }
                        }

                        annualReport.setFiles(fileEntities);
                        // ✅ cascade=CascadeType.ALL saves the files automatically
                        makzanAnnualReportRepository.save(annualReport);
                }

                // 3. Audit log
                auditLogHelper.logCreate(
                                TABLE_NAME,
                                annualReport.getId().longValue(),
                                annualReport.getDescription());

                return annualReport;
        }

        // ─── UPDATE ─────────────────────────────────────────────────────────────────
        @Transactional
        public MakzanAnnualReport updateAnnualReport(
                        Integer id,
                        MakzanAnnualReport annualReportDetails,
                        MultipartFile[] fileURL, List<String> scannerFiles
                ) {

                MakzanAnnualReport existingReport = makzanAnnualReportRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("AnnualReport not found with id: " + id));

                // Update fields
                existingReport.setProvince(annualReportDetails.getProvince());
                existingReport.setDistrict(annualReportDetails.getDistrict());
                existingReport.setYear(annualReportDetails.getYear());
                existingReport.setDocType(annualReportDetails.getDocType());
                existingReport.setSummaryWaseqa(annualReportDetails.getSummaryWaseqa());
                existingReport.setDescription(annualReportDetails.getDescription());
                existingReport.setCabinetFile(annualReportDetails.getCabinetFile());

                logger.info("Updating MakzanAnnualReport id: {}", id);
                boolean hasNewFiles = (fileURL != null && fileURL.length > 0);
                boolean hasScannerFiles = (scannerFiles != null && !scannerFiles.isEmpty());

                if (hasNewFiles || hasScannerFiles) {
                        // ✅ Delete old files from disk and DB
                        if (existingReport.getFiles() != null && !existingReport.getFiles().isEmpty()) {
                                for (FileEntity oldFile : existingReport.getFiles()) {
                                                fileService.deleteFile(oldFile.getFilePath());
                                        logger.info("Deleted old file: {}", oldFile.getFileName());
                                }
                                existingReport.getFiles().clear();
                                fileRepository.flush(); // ✅ make sure deletes happen before inserts
                        }
                }

                // ── Handle manual uploaded files ──────────────────────
                if (hasNewFiles) {
                        List<String> storedPaths = fileService.savefiles(fileURL, existingReport);

                        for (int i = 0; i < fileURL.length; i++) {
                                MultipartFile file = fileURL[i];
                                if (file == null || file.isEmpty())
                                        continue;


                                FileEntity fe = new FileEntity();
                                fe.setFilePath(storedPaths.get(i));
                                fe.setFileName(file.getOriginalFilename()); // ✅ keep original name
                                fe.setFileType(file.getContentType());
                                fe.setFileSize(file.getSize());
                                fe.setMakzanAnnualReport(existingReport);
                                fileRepository.save(fe);
                                existingReport.getFiles().add(fe);
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
                                        fe.setMakzanAnnualReport(existingReport);
                                        fileRepository.save(fe);
                                        existingReport.getFiles().add(fe);
                                        System.out.println("✅ Scanner file on update: " + scannerFileName);

                                } catch (java.io.IOException e) {
                                        System.err.println("❌ Scanner file failed: " + scannerFileName + " - "
                                                        + e.getMessage());
                        }
                }
                }

                MakzanAnnualReport updated = makzanAnnualReportRepository.save(existingReport);
                auditLogHelper.logUpdate(TABLE_NAME, existingReport.getId().longValue(),
                                existingReport.getDescription());
                return updated;
        }

        // ─── DELETE ─────────────────────────────────────────────────────────────────
        public void deleteAnnualReport(Integer id) {
                MakzanAnnualReport annualReport = makzanAnnualReportRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("annualReport not found with id: " + id));

                auditLogHelper.logDelete(
                                TABLE_NAME,
                                id.longValue(),
                                annualReport.getDescription());

                makzanAnnualReportRepository.delete(annualReport);
                logger.info("Deleted MakzanAnnualReport id: {}", id);
        }
}