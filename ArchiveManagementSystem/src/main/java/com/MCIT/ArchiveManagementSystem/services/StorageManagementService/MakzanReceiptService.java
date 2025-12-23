package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;


import java.util.List;
import java.util.Optional;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;

import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.HifziyaWaradaSaderaService;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import java.util.ArrayList;



@Service
public class MakzanReceiptService {

    

          private static final Logger logger = LoggerFactory.getLogger(HifziyaWaradaSaderaService.class);


    private final MakzanReceiptRepository makzanReceiptRepository;
    private final FileService fileService;
    private final FileRepository fileRepository;



    public MakzanReceiptService(MakzanReceiptRepository makzanReceiptRepository, FileService fileService, FileRepository fileRepository) {
        this.makzanReceiptRepository = makzanReceiptRepository;
        this.fileService = fileService;
        this.fileRepository = fileRepository;
     

    }

    public List<MakzanReceipt> getAllReceipts() {
        return makzanReceiptRepository.findAll();
    }

    public Optional<MakzanReceipt> getReceiptById(Integer id) {
        return makzanReceiptRepository.findById(id);
    }

@Transactional
public MakzanReceipt createReceipt(MakzanReceipt makzanReceipts, MultipartFile fileURL) {
    
    // Save the main entity first (without files)
    MakzanReceipt savedEntity = makzanReceiptRepository.save(makzanReceipts);
    
    if (fileURL != null && !fileURL.isEmpty()) {
        try {
            // This already saves the file to disk AND database
            fileService.savefile(fileURL, savedEntity);
            
            // NO NEED TO SAVE AGAIN - remove all the code below!
            // The fileService.savefile() already handled everything
            
        } catch (Exception e) {
            logger.error("Failed to save file: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save file: " + e.getMessage(), e);
        }
    }
    
    return savedEntity;
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

    // 4. وروستی ریکارډ ذخیره کړه او واپس یې کړه
    return makzanReceiptRepository.save(makzanReceipts);
}

    public void deleteReceipt(Integer id) {
        MakzanReceipt makzanReceipts = makzanReceiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));
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