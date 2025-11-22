package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;


import java.util.List;
import java.util.Optional;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import java.util.ArrayList;



@Service
public class MakzanReceiptService {

    

  

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
public MakzanReceipt createReceipt(MakzanReceipt makzanReceipts, MultipartFile fileURL) {
    // 1. MakzanReceipt ذخیره کړه
    makzanReceipts = makzanReceiptRepository.save(makzanReceipts);

    // 2. که فایل موجود وي، ذخیره یې کړه
    if (fileURL != null && !fileURL.isEmpty()) {
        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(fileService.savefile(fileURL, makzanReceipts));
        fileEntity.setFileName(fileURL.getOriginalFilename());
        fileEntity.setFileType(fileURL.getContentType());
        fileEntity.setMakzanReceipt(makzanReceipts);      // د ریکارډ سره تړاو
        fileRepository.save(fileEntity);            // DB ته ذخیره
        makzanReceipts.getFiles().add(fileEntity);        // لیست ته اضافه
    }

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


}