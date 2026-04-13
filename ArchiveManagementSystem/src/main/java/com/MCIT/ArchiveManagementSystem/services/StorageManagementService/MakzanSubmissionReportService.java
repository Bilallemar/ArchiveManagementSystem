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

import com.MCIT.ArchiveManagementSystem.dtos.MakzanSubmissionReportSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanSubmissionReportRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

import jakarta.transaction.Transactional;

@Service
public class MakzanSubmissionReportService {
        @Value("${spring.file.directory}")
        private String uploadDir;

        @Value("${scanner.folder.path}")
        private String scannerFolderPath;
        private final MakzanSubmissionReportRepository makzanSubmissionReportRepository;
        private final AuditLogHelper auditLogHelper;
        private static final Logger logger = LoggerFactory.getLogger(MakzanSubmissionReportService.class);
        private static final String TABLE_NAME = "makzan_submission_report";
        private final FileService fileService;
        private final FileRepository fileRepository;

        public MakzanSubmissionReportService(MakzanSubmissionReportRepository makzanSubmissionReportRepository,
                        AuditLogHelper auditLogHelper, FileService fileService, FileRepository fileRepository) {
                this.makzanSubmissionReportRepository = makzanSubmissionReportRepository;
                this.auditLogHelper = auditLogHelper;
                this.fileService = fileService;
                this.fileRepository = fileRepository;
        }

        private String sanitizeFileName(String originalName) {
                if (originalName == null) {
                        return "file_" + System.currentTimeMillis();
                }
                String sanitized = originalName.replaceAll("[^\\p{ASCII}]", "_");
                logger.info("Filename sanitized: '{}' → '{}'", originalName, sanitized);
                return sanitized;
        }

        public Page<MakzanSubmissionReportSummaryDTO> gitAllMakzanSubmissionReport(
                        Management management,
                        String field,
                        String term,
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size);
                String cleanTerm = (term == null) ? "" : term.trim();

                // Convert String → enum

                Page<MakzanSubmissionReport> raw = makzanSubmissionReportRepository.searchMakzanSubmissionReport(
                                management, field, cleanTerm, pageable); // ← directionEnum not cleanDirection

                return raw.map(a -> new MakzanSubmissionReportSummaryDTO(
                                a.getId(),
                                a.getYear(),
                                a.getProvince() != null ? a.getProvince().getName() : null,
                                a.getDistrict() != null ? a.getDistrict().getName() : null));
        }

        public Optional<MakzanSubmissionReport> getMakzanSubmissionReportById(Integer id) {
                return makzanSubmissionReportRepository.findById(id);
        }

        @Transactional
        public MakzanSubmissionReport createMakzanSubmissionReport(
                        MakzanSubmissionReport report,
                        MultipartFile[] fileURL,
                        List<String> scannerFileNames) {

                report = makzanSubmissionReportRepository.save(report);
                List<FileEntity> fileEntities = new ArrayList<>(); // ✅ moved outside

                // ── Manual files ──────────────────────────────────────────
                if (fileURL != null && fileURL.length > 0) {
                        List<String> storedPaths = fileService.savefiles(fileURL, report);

                        for (int i = 0; i < fileURL.length; i++) {
                                MultipartFile file = fileURL[i];
                                if (file == null || file.isEmpty())
                                        continue;

                                FileEntity fe = new FileEntity();
                                fe.setFilePath(storedPaths.get(i));
                                fe.setFileName(file.getOriginalFilename());
                                fe.setFileType(file.getContentType());
                                fe.setFileSize(file.getSize());
                                fe.setMakzanSubmissionReport(report);
                                fileRepository.save(fe);
                                fileEntities.add(fe);
                                System.out.println("✅ Manual file saved: " + file.getOriginalFilename());
                        }
                }

                // ── Scanner files ─────────────────────────────────────────
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
                                        fe.setMakzanSubmissionReport(report);
                                        fileRepository.save(fe);
                                        fileEntities.add(fe);
                                        System.out.println("✅ Scanner file saved: " + scannerFileName);

                                } catch (java.io.IOException e) {
                                        logger.error("❌ Failed to copy scanner file: {}", scannerFileName, e);
                        }
                        }
                }

                // ✅ Always set files even if empty
                        report.setFiles(fileEntities);
                        makzanSubmissionReportRepository.save(report);

                auditLogHelper.logCreate(TABLE_NAME, report.getId().longValue(), report.getDescription());
                return report;
        }

        @Transactional
        public void updateMakzanSubmissionReport(
                        Integer id,
                        MakzanSubmissionReport reportDetails,
                        MultipartFile[] fileURL,
                        List<String> scannerFileNames) { // ✅ add parameter

                MakzanSubmissionReport existing = makzanSubmissionReportRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Not found: " + id));

                // ── Update fields ─────────────────────────────────────
                existing.setProvince(reportDetails.getProvince());
                existing.setDistrict(reportDetails.getDistrict());
                existing.setYear(reportDetails.getYear());
                existing.setDocType(reportDetails.getDocType());
                existing.setSummaryWaseqa(reportDetails.getSummaryWaseqa());
                existing.setDescription(reportDetails.getDescription());
                existing.setCabinetFile(reportDetails.getCabinetFile());

                boolean hasNewFiles = (fileURL != null && fileURL.length > 0);
                boolean hasScannerFiles = (scannerFileNames != null && !scannerFileNames.isEmpty());

                // ── Delete old files only if new ones are coming ──────
                if (hasNewFiles || hasScannerFiles) {
                        if (existing.getFiles() != null && !existing.getFiles().isEmpty()) {
                                for (FileEntity old : existing.getFiles()) {
                                        fileService.deleteFile(old.getFilePath());
                                }
                                existing.getFiles().clear();
                                makzanSubmissionReportRepository.saveAndFlush(existing);
                        }
                }

                // ── Manual files ──────────────────────────────────────
                if (hasNewFiles) {
                        List<String> storedPaths = fileService.savefiles(fileURL, existing);
                        for (int i = 0; i < fileURL.length; i++) {
                                MultipartFile file = fileURL[i];
                                if (file == null || file.isEmpty())
                                        continue;

                                FileEntity fe = new FileEntity();
                                fe.setFilePath(storedPaths.get(i));
                                fe.setFileName(file.getOriginalFilename()); // ✅ no sanitize
                                fe.setFileType(file.getContentType());
                                fe.setFileSize(file.getSize());
                                fe.setMakzanSubmissionReport(existing);
                                fileRepository.save(fe);
                                existing.getFiles().add(fe);
        }
                }

                // ── Scanner files ─────────────────────────────────────
                if (hasScannerFiles) {
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
                                        fe.setMakzanSubmissionReport(existing); // ✅ set correct parent
                                        fileRepository.save(fe);
                                        existing.getFiles().add(fe);
                                } catch (java.io.IOException e) {
                                        logger.error("Failed to copy scanner file: {}", scannerFileName, e);
                                }
                        }
                }

                makzanSubmissionReportRepository.save(existing);
                auditLogHelper.logUpdate(TABLE_NAME, id.longValue(), existing.getDescription());
        }

        public void deleteMakzanSubmissionReport(Integer id) {
                MakzanSubmissionReport annualReport = makzanSubmissionReportRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("annualReportInfo not found with id: " + id));

                // ✅ Log BEFORE delete
                auditLogHelper.logDelete(TABLE_NAME, id.longValue(), annualReport.getDescription());

                makzanSubmissionReportRepository.delete(annualReport);
        }
}