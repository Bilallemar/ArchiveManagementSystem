package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
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

    public List<MakzanReceipt> getAllReceipts() {
        return makzanReceiptRepository.findAll();
    }

    public Optional<MakzanReceipt> getReceiptById(Integer id) {
        return makzanReceiptRepository.findById(id);
    }

    @Transactional
    public MakzanReceipt createReceipt(MakzanReceipt makzanReceipts, MultipartFile[] fileURL) {
        System.out.println("Saving MakzanReceipt: " + makzanReceipts);
        // Save the main entity first (without files)
        makzanReceipts = makzanReceiptRepository.save(makzanReceipts);
        if (fileURL != null && fileURL.length > 0) {
            System.out.println("Saving " + fileURL.length + " files");

            // Save all files using fileService
            List<String> storedPaths = fileService.savefiles(fileURL, makzanReceipts);

            // Create FileEntity for each uploaded file
            List<FileEntity> fileEntities = new ArrayList<>();
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

            makzanReceipts.setFiles(fileEntities);
        } else {
            System.out.println("No files to save in Service");
        }

        auditLogHelper.logCreate(TABLE_NAME, makzanReceipts.getId().longValue(),
                makzanReceipts.getDescription());
        return makzanReceipts;
    }

    // @Transactional
    // public MakzanReceipt updateReceipt(Integer id, MakzanReceipt
    // makzanReceiptsDetails, MultipartFile[] fileURL) {
    // // 1. موجوده ریکارډ ترلاسه کړه
    // MakzanReceipt makzanReceipts = makzanReceiptRepository.findById(id)
    // .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

    // // 2. اصلي فیلډونه اپډېټ کړه
    // makzanReceipts.setDocNo(makzanReceiptsDetails.getDocNo());
    // makzanReceipts.setOrg(makzanReceiptsDetails.getOrg());

    // makzanReceipts.setDepartment(makzanReceiptsDetails.getDepartment());
    // makzanReceipts.setLetterNo(makzanReceiptsDetails.getLetterNo());
    // makzanReceipts.setLetterDate(makzanReceiptsDetails.getLetterDate());
    // makzanReceipts.setSubjectType(makzanReceiptsDetails.getSubjectType());
    // makzanReceipts.setDescription(makzanReceiptsDetails.getDescription());

    // // 3. فایلونه اپډېټ یا اضافه کړه که موجود وي
    // if (fileURL != null && fileURL.length > 0) {
    // // 3a. موجوده فایلونه حذف کړه
    // if (makzanReceipts.getFiles() != null) {
    // for (FileEntity oldFile : makzanReceipts.getFiles()) {
    // fileService.deleteFile(oldFile.getFilePath()); // د حقیقي مسیر نه فایل حذف
    // fileRepository.delete(oldFile); // DB نه حذف
    // }
    // makzanReceipts.getFiles().clear();
    // }

    // // 3b. نوي فایلونه ذخیره کړه
    // List<String> storedPaths = fileService.savefiles(fileURL, makzanReceipts); //
    // د څو فایلونو save method

    // List<FileEntity> newAttachments = new ArrayList<>();
    // for (int i = 0; i < fileURL.length; i++) {
    // MultipartFile f = fileURL[i];
    // FileEntity fe = new FileEntity();
    // fe.setFilePath(storedPaths.get(i)); // حقیقي مسیر
    // fe.setFileName(f.getOriginalFilename()); // د فایل اصل نوم
    // fe.setFileType(f.getContentType()); // فایل ټایپ
    // fe.setMakzanReceipt(makzanReceipts); // د ریکارډ سره رابطه
    // fileRepository.save(fe); // DB ته ذخیره کړه
    // newAttachments.add(fe);
    // }

    // makzanReceipts.setFiles(newAttachments);
    // }

    // auditLogHelper.logUpdate(TABLE_NAME, makzanReceipts.getId().longValue(),
    // makzanReceipts.getDescription());

    // // 4. وروستی ریکارډ ذخیره کړه او واپس یې کړه
    // return makzanReceiptRepository.save(makzanReceipts);
    // }
    @Transactional
    public void updateReceipt(
            Integer id,
            MakzanReceipt makzanReceiptDetails,
            MultipartFile[] fileURL) {

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

        logger.info("Updating MakzanReceipt id: {}", id);

        // Update files only if new files were provided
        if (fileURL != null && fileURL.length > 0) {

            if (makzanReceipts.getFiles() != null && !makzanReceipts.getFiles().isEmpty()) {
                for (FileEntity oldFile : makzanReceipts.getFiles()) {
                    try {
                        fileService.deleteFile(oldFile.getFilePath());
                    } catch (Exception e) {
                        logger.warn("Could not delete file: {}", e.getMessage());
                    }
                }
                makzanReceipts.getFiles().clear(); // ← orphanRemoval handles DB delete
                makzanReceiptRepository.saveAndFlush(makzanReceipts); // ← flush BEFORE adding new
                                                                      // files
            }

            List<String> storedPaths = fileService.savefiles(fileURL, makzanReceipts);

            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile f = fileURL[i];
                if (f == null || f.isEmpty())
                    continue;

                String safeName = sanitizeFileName(f.getOriginalFilename());

                FileEntity fe = new FileEntity();
                fe.setFilePath(storedPaths.get(i));
                fe.setFileName(safeName);
                fe.setFileType(f.getContentType());
                fe.setMakzanReceipt(makzanReceipts);

                makzanReceipts.getFiles().add(fe); // ← add to existing list, don't replace it
                logger.info("New file queued: {}", safeName);
            }
        }

        makzanReceiptRepository.save(makzanReceipts);

        auditLogHelper.logUpdate(
                TABLE_NAME,
                id.longValue(),
                makzanReceipts.getDescription());

        logger.info("Update completed for MakzanReceipt id: {}", id);
    }

    public void deleteReceipt(Integer id) {
        MakzanReceipt makzanReceipts = makzanReceiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

        auditLogHelper.logDelete(TABLE_NAME, id.longValue(), makzanReceipts.getDescription());

        makzanReceiptRepository.delete(makzanReceipts);
    }

    public List<MakzanReceipt> searchByKeyword(String field, String keyword) {
        // If no keyword, return all
        if (keyword == null || keyword.trim().isEmpty()) {
            return makzanReceiptRepository.findAll();
        }

        // Search specific field or all fields
        if (field == null || field.trim().isEmpty()) {
            return makzanReceiptRepository.searchAllFields(keyword);
        }

        switch (field.toLowerCase()) {

            case "docno":
                return makzanReceiptRepository.searchByDocNo(keyword);
            case "letterno":
                return makzanReceiptRepository.searchByLetterNo(keyword);
            case "subjecttype":
                return makzanReceiptRepository.searchBySubjectType(keyword);
            case "description":
                return makzanReceiptRepository.searchByDescription(keyword);
            default:
                return makzanReceiptRepository.searchAllFields(keyword);
        }
    }
}