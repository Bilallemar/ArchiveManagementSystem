package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanAnnualReport;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanAnnualReportRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

import jakarta.transaction.Transactional;

@Service
public class MakzanAnnualReportService {

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
        public List<MakzanAnnualReport> gitAllAnnualReports() {
                return makzanAnnualReportRepository.findAll();
        }

        // ─── GET BY ID ──────────────────────────────────────────────────────────────
        public Optional<MakzanAnnualReport> getAnnualReportById(Integer id) {
                return makzanAnnualReportRepository.findById(id);
        }

        // ─── CREATE ─────────────────────────────────────────────────────────────────
        @Transactional
        public MakzanAnnualReport createAnnualReport(
                        MakzanAnnualReport annualReport,
                        MultipartFile[] fileURL) {

                // 1. Save main entity first
                annualReport = makzanAnnualReportRepository.save(annualReport);
                logger.info("MakzanAnnualReport created with id: {}", annualReport.getId());

                // 2. Save files
                if (fileURL != null && fileURL.length > 0) {
                        List<String> storedPaths = fileService.savefiles(fileURL, annualReport);
                        List<FileEntity> fileEntities = new ArrayList<>();

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
        public void updateAnnualReport(
                        Integer id,
                        MakzanAnnualReport annualReportDetails,
                        MultipartFile[] fileURL) {

                MakzanAnnualReport existingReport = makzanAnnualReportRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("AnnualReport not found with id: " + id));

                // Update fields
                existingReport.setProvince(annualReportDetails.getProvince());
                existingReport.setDistrict(annualReportDetails.getDistrict());
                existingReport.setYear(annualReportDetails.getYear());
                existingReport.setDocType(annualReportDetails.getDocType());
                existingReport.setSummaryWaseqa(annualReportDetails.getSummaryWaseqa());
                existingReport.setDescription(annualReportDetails.getDescription());

                logger.info("Updating MakzanAnnualReport id: {}", id);

                // Update files only if new files were provided
                if (fileURL != null && fileURL.length > 0) {

                        if (existingReport.getFiles() != null && !existingReport.getFiles().isEmpty()) {
                                for (FileEntity oldFile : existingReport.getFiles()) {
                                        try {
                                                fileService.deleteFile(oldFile.getFilePath());
                                        } catch (Exception e) {
                                                logger.warn("Could not delete file: {}", e.getMessage());
                                        }
                                }
                                existingReport.getFiles().clear(); // ← orphanRemoval handles DB delete
                                makzanAnnualReportRepository.saveAndFlush(existingReport); // ← flush BEFORE adding new
                                                                                           // files
                        }

                        List<String> storedPaths = fileService.savefiles(fileURL, existingReport);

                        for (int i = 0; i < fileURL.length; i++) {
                                MultipartFile f = fileURL[i];
                                if (f == null || f.isEmpty())
                                        continue;

                                String safeName = sanitizeFileName(f.getOriginalFilename());

                                FileEntity fe = new FileEntity();
                                fe.setFilePath(storedPaths.get(i));
                                fe.setFileName(safeName);
                                fe.setFileType(f.getContentType());
                                fe.setMakzanAnnualReport(existingReport);

                                existingReport.getFiles().add(fe); // ← add to existing list, don't replace it
                                logger.info("New file queued: {}", safeName);
                        }
                }

                makzanAnnualReportRepository.save(existingReport);

                auditLogHelper.logUpdate(
                                TABLE_NAME,
                                id.longValue(),
                                existingReport.getDescription());

                logger.info("Update completed for MakzanAnnualReport id: {}", id);
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