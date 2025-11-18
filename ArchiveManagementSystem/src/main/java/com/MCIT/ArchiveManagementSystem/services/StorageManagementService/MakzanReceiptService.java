package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;


import java.util.List;
import java.util.Optional;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class MakzanReceiptService {

    

  

    private final MakzanReceiptRepository makzanReceiptRepository;



    public MakzanReceiptService(MakzanReceiptRepository makzanReceiptRepository ) {
        this.makzanReceiptRepository = makzanReceiptRepository;
     

    }

    public List<MakzanReceipt> getAllReceipts() {
        return makzanReceiptRepository.findAll();
    }

    public Optional<MakzanReceipt> getReceiptById(Integer id) {
        return makzanReceiptRepository.findById(id);
    }

    public MakzanReceipt createReceipt(MakzanReceipt receipts,MultipartFile fileURL)  {
        receipts = makzanReceiptRepository.save(receipts);

        // FileEntity fileEntity = new FileEntity();
        // fileEntity.setFilePath(fileService.savefile(fileURL,receipts));

        return receipts;
    }

   @Transactional
public MakzanReceipt updateReceipt(Integer id, MakzanReceipt receiptsDetails, MultipartFile[] fileURL) {
    // 1. موجوده ریکارډ ترلاسه کړه
    MakzanReceipt receipts = makzanReceiptRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

    // 2. اصلي فیلډونه اپډېټ کړه
    receipts.setLetterNo(receiptsDetails.getLetterNo());
    receipts.setLetterDate(receiptsDetails.getLetterDate());
    receipts.setSubjectType(receiptsDetails.getSubjectType());
    receipts.setFile(receiptsDetails.getFile());
    receipts.setDescription(receiptsDetails.getDescription());
   

    // 3. فایلونه اپډېټ یا اضافه کړه که موجود وي
    // if (fileURL != null && fileURL.length > 0) {
    //     // 3a. موجوده فایلونه حذف کړه
    //     if (receipts.getAttachments() != null) {
    //         for (FileEntity oldFile : receipts.getAttachments()) {
    //             fileService.deleteFile(oldFile.getFilePath()); // د حقیقي مسیر نه فایل حذف
    //             fileRepository.delete(oldFile);               // DB نه حذف
    //         }
    //         receipts.getAttachments().clear();
    //     }

        // 3b. نوي فایلونه ذخیره کړه
    //     List<String> storedPaths = fileService.savefiles(fileURL, receipts); // د څو فایلونو save method

    //     List<FileEntity> newAttachments = new ArrayList<>();
    //     for (int i = 0; i < fileURL.length; i++) {
    //         MultipartFile f = fileURL[i];
    //         FileEntity fe = new FileEntity();
    //         fe.setFilePath(storedPaths.get(i));         // حقیقي مسیر
    //         fe.setFileName(f.getOriginalFilename());   // د فایل اصل نوم
    //         fe.setFileType(f.getContentType());        // فایل ټایپ
    //         fe.setReceipt(receipts);                   // د ریکارډ سره رابطه
    //         fileRepository.save(fe);                   // DB ته ذخیره کړه
    //         newAttachments.add(fe);
    //     }

    //     receipts.setAttachments(newAttachments);
    // }

    // 4. وروستی ریکارډ ذخیره کړه او واپس یې کړه
    return makzanReceiptRepository.save(receipts);
}

    public void deleteReceipt(Integer id) {
        MakzanReceipt receipts = makzanReceiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));
        makzanReceiptRepository.delete(receipts);
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