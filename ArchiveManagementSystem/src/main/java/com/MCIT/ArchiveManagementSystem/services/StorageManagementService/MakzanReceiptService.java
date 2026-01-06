package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;


import java.util.List;
import java.util.Optional;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;

import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.AuditLog;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.HifziyaWaradaSaderaService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;
import com.MCIT.ArchiveManagementSystem.repositories.AuditLogRepository;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;



@Service
public class MakzanReceiptService {
 private static final String TABLE_NAME = "makzan_receipt";
    private final AuditLogHelper auditLogHelper;


    

          private static final Logger logger = LoggerFactory.getLogger(HifziyaWaradaSaderaService.class);


    private final MakzanReceiptRepository makzanReceiptRepository;
    private final FileService fileService;
    private final FileRepository fileRepository;
        private final AuditLogRepository auditLogRepository;




    public MakzanReceiptService(MakzanReceiptRepository makzanReceiptRepository, FileService fileService, FileRepository fileRepository, AuditLogRepository auditLogRepository,AuditLogHelper auditLogHelper) {
        this.makzanReceiptRepository = makzanReceiptRepository;
        this.fileService = fileService;
        this.fileRepository = fileRepository;
        this.auditLogRepository = auditLogRepository;
        this.auditLogHelper = auditLogHelper;
     
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
                
                System.out.println("Saved file " + (i+1) + ": " + file.getOriginalFilename());
            }
            
            makzanReceipts.setFiles(fileEntities);
        } else {
            System.out.println("No files to save in Service");
        }

        auditLogHelper.logCreate(TABLE_NAME, makzanReceipts.getId().longValue(), 
            makzanReceipts.getDescription());
        return makzanReceipts;
    }

   @Transactional
public MakzanReceipt updateReceipt(Integer id, MakzanReceipt makzanReceiptsDetails, MultipartFile[] fileURL) {
    // 1. موجوده ریکارډ ترلاسه کړه
    MakzanReceipt makzanReceipts = makzanReceiptRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

    // 2. اصلي فیلډونه اپډېټ کړه
    makzanReceipts.setLetterNo(makzanReceiptsDetails.getLetterNo());
    makzanReceipts.setLetterDate(makzanReceiptsDetails.getLetterDate());
    makzanReceipts.setSubjectType(makzanReceiptsDetails.getSubjectType());
    makzanReceipts.setDescription(makzanReceiptsDetails.getDescription());
   

    // 3. فایلونه اپډېټ یا اضافه کړه که موجود وي
    if (fileURL != null && fileURL.length > 0) {
        // 3a. موجوده فایلونه حذف کړه
        if (makzanReceipts.getFiles() != null) {
            for (FileEntity oldFile : makzanReceipts.getFiles()) {
                fileService.deleteFile(oldFile.getFilePath()); // د حقیقي مسیر نه فایل حذف
                fileRepository.delete(oldFile);               // DB نه حذف
            }
            makzanReceipts.getFiles().clear();
        }

        // 3b. نوي فایلونه ذخیره کړه
        List<String> storedPaths = fileService.savefiles(fileURL, makzanReceipts); // د څو فایلونو save method

        List<FileEntity> newAttachments = new ArrayList<>();
        for (int i = 0; i < fileURL.length; i++) {
            MultipartFile f = fileURL[i];
            FileEntity fe = new FileEntity();
            fe.setFilePath(storedPaths.get(i));         // حقیقي مسیر
            fe.setFileName(f.getOriginalFilename());   // د فایل اصل نوم
            fe.setFileType(f.getContentType());        // فایل ټایپ
            fe.setMakzanReceipt(makzanReceipts);                   // د ریکارډ سره رابطه
            fileRepository.save(fe);                   // DB ته ذخیره کړه
            newAttachments.add(fe);
        }

        makzanReceipts.setFiles(newAttachments);
    }

        auditLogHelper.logUpdate(TABLE_NAME, makzanReceipts.getId().longValue(), makzanReceipts.getDescription());

    // 4. وروستی ریکارډ ذخیره کړه او واپس یې کړه
    return makzanReceiptRepository.save(makzanReceipts);
}

    public void deleteReceipt(Integer id) {
        MakzanReceipt makzanReceipts = makzanReceiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

                                    auditLogHelper.logDelete(TABLE_NAME, id.longValue(), makzanReceipts.getDescription());

        makzanReceiptRepository.delete(makzanReceipts);
    }


// public List<MakzanReceipt> searchByKeyword(String field, String keyword) {
//     // keyword null یا empty وي، ټول ریکارډونه راوړه
//     if (keyword == null || keyword.trim().isEmpty()) {
//         return makzanReceiptRepository.findAll();
//     }

//     // field null یا empty وي، default search په ټولو فیلډونو
//     if (field == null || field.trim().isEmpty()) {
//         return makzanReceiptRepository
//             .findBySerialNumberContainingIgnoreCaseOrArchiveNumberContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase
//             (
//                 keyword, keyword, keyword, keyword, keyword
//             );
//     }

//     // اوس safe ده چې switch وکاروې
//     switch (field) {
//         case "serialNumber":
//             return makzanReceiptRepository.findBySerialNumberContainingIgnoreCase(keyword);
//         case "archiveNumber":
//             return makzanReceiptRepository.findByArchiveNumberContainingIgnoreCase(keyword);
//         case "department":
//             return makzanReceiptRepository.findByDepartmentContainingIgnoreCase(keyword);
//         case "recipient":
//             return makzanReceiptRepository.findByRecipientContainingIgnoreCase(keyword);
//         case "sender":
//             return makzanReceiptRepository.findBySenderContainingIgnoreCase(keyword);
//         default:
//             return makzanReceiptRepository
//                 .findBySerialNumberContainingIgnoreCaseOrArchiveNumberContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
//                     keyword, keyword, keyword, keyword, keyword
//                 );
//     }
// }

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
        case "no":
            return makzanReceiptRepository.searchByNo(keyword);
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