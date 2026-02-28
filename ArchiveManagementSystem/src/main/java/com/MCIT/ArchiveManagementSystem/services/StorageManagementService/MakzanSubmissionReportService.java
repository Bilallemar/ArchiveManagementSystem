package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanSubmissionReportRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

import jakarta.transaction.Transactional;

@Service
public class MakzanSubmissionReportService {
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

        public List<MakzanSubmissionReport> gitAllMakzanSubmissionReport() {
                return makzanSubmissionReportRepository.findAll();
        }

        public Optional<MakzanSubmissionReport> getMakzanSubmissionReportById(Integer id) {
                return makzanSubmissionReportRepository.findById(id);
        }

        @Transactional
        public MakzanSubmissionReport createMakzanSubmissionReport(
                        MakzanSubmissionReport report,
                        MultipartFile[] fileURL) {

                report = makzanSubmissionReportRepository.save(report);

                if (fileURL != null && fileURL.length > 0) {

                        List<String> storedPaths = fileService.savefiles(fileURL, report);

                        List<FileEntity> fileEntities = new ArrayList<>();

                        for (int i = 0; i < fileURL.length; i++) {

                                MultipartFile file = fileURL[i];

                                FileEntity fileEntity = new FileEntity();

                                fileEntity.setFilePath(
                                                storedPaths.get(i));

                                fileEntity.setFileName(
                                                file.getOriginalFilename());

                                fileEntity.setFileType(
                                                file.getContentType());

                                fileEntity.setMakzanSubmissionReport(
                                                report);

                                fileRepository.save(fileEntity);

                                fileEntities.add(fileEntity);
                        }

                        report.setFiles(fileEntities);
                        makzanSubmissionReportRepository.save(report);
                }

                auditLogHelper.logCreate(
                                TABLE_NAME,
                                report.getId().longValue(),
                                report.getDescription());

                return report;
        }

        @Transactional
        public void updateMakzanSubmissionReport(
                        Integer id,
                        MakzanSubmissionReport makzanSubmissionReportDetails,
                        MultipartFile[] fileURL) {

                MakzanSubmissionReport existingReport = makzanSubmissionReportRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "MakzanSubmissionReport not found with id: " + id));

                // Update fields
                existingReport.setProvince(makzanSubmissionReportDetails.getProvince());
                existingReport.setDistrict(makzanSubmissionReportDetails.getDistrict());
                existingReport.setYear(makzanSubmissionReportDetails.getYear());
                existingReport.setDocType(makzanSubmissionReportDetails.getDocType());
                existingReport.setSummaryWaseqa(makzanSubmissionReportDetails.getSummaryWaseqa());
                existingReport.setDescription(makzanSubmissionReportDetails.getDescription());

                logger.info("Updating MakzanSubmissionReport id: {}", id);

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
                                makzanSubmissionReportRepository.saveAndFlush(existingReport); // ← flush BEFORE adding
                                                                                               // new
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
                                fe.setMakzanSubmissionReport(existingReport);

                                existingReport.getFiles().add(fe); // ← add to existing list, don't replace it
                                logger.info("New file queued: {}", safeName);
                        }
                }

                makzanSubmissionReportRepository.save(existingReport);

                auditLogHelper.logUpdate(
                                TABLE_NAME,
                                id.longValue(),
                                existingReport.getDescription());

                logger.info("Update completed for MakzanAnnualReport id: {}", id);
        }

        // @Transactional
        // public MakzanSubmissionReport updateMakzanSubmissionReport(
        // Integer id,
        // MakzanSubmissionReport reportDetails,
        // MultipartFile[] fileURL) {

        // MakzanSubmissionReport existingReport =
        // makzanSubmissionReportRepository.findById(id)
        // .orElseThrow(() -> new RuntimeException(
        // "Report not found with id: " + id));

        // existingReport.setProvince(
        // reportDetails.getProvince());

        // existingReport.setDistrict(
        // reportDetails.getDistrict());

        // existingReport.setYear(
        // reportDetails.getYear());

        // existingReport.setDocType(
        // reportDetails.getDocType());

        // existingReport.setSummaryWaseqa(
        // reportDetails.getSummaryWaseqa());

        // existingReport.setDescription(
        // reportDetails.getDescription());

        // if (fileURL != null && fileURL.length > 0) {

        // if (existingReport.getFiles() != null) {

        // for (FileEntity oldFile : existingReport.getFiles()) {

        // fileService.deleteFile(
        // oldFile.getFilePath());

        // fileRepository.delete(oldFile);
        // }

        // existingReport.getFiles().clear();
        // }

        // List<String> storedPaths = fileService.savefiles(
        // fileURL,
        // existingReport);

        // List<FileEntity> newFiles = new ArrayList<>();

        // for (int i = 0; i < fileURL.length; i++) {

        // MultipartFile f = fileURL[i];

        // FileEntity fe = new FileEntity();

        // fe.setFilePath(
        // storedPaths.get(i));

        // fe.setFileName(
        // f.getOriginalFilename());

        // fe.setFileType(
        // f.getContentType());

        // fe.setMakzanSubmissionReport(
        // existingReport);

        // fileRepository.save(fe);

        // newFiles.add(fe);
        // }

        // existingReport.setFiles(newFiles);
        // }

        // MakzanSubmissionReport updated =
        // makzanSubmissionReportRepository.save(existingReport);

        // auditLogHelper.logUpdate(
        // TABLE_NAME,
        // id.longValue(),
        // updated.getDescription());

        // return updated;
        // }

        public void deleteMakzanSubmissionReport(Integer id) {
                MakzanSubmissionReport annualReport = makzanSubmissionReportRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("annualReportInfo not found with id: " + id));

                // ✅ Log BEFORE delete
                auditLogHelper.logDelete(TABLE_NAME, id.longValue(), annualReport.getDescription());

                makzanSubmissionReportRepository.delete(annualReport);
        }
}