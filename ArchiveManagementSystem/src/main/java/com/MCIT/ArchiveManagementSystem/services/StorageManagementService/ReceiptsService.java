package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.Receipts;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.ReceiptsRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class ReceiptsService {

    

    private final FileService fileService;

    private final ReceiptsRepository receiptsRepository;
    private final FileRepository fileRepository;


    public ReceiptsService(ReceiptsRepository receiptsRepository, FileService fileService,
                           FileRepository fileRepository) {
        this.receiptsRepository = receiptsRepository;
        this.fileService = fileService;
        this.fileRepository = fileRepository;

    }

    public List<Receipts> getAllReceipts() {
        return receiptsRepository.findAll();
    }

    public Optional<Receipts> getReceiptById(Long id) {
        return receiptsRepository.findById(id);
    }

    public Receipts createReceipt(Receipts receipts,MultipartFile fileURL)  {
        receipts = receiptsRepository.save(receipts);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(fileService.savefile(fileURL,receipts));

        return receipts;
    }

   @Transactional
public Receipts updateReceipt(Long id, Receipts receiptsDetails, MultipartFile[] fileURL) {
    // 1. موجوده ریکارډ ترلاسه کړه
    Receipts receipts = receiptsRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

    // 2. اصلي فیلډونه اپډېټ کړه
    receipts.setSerialNumber(receiptsDetails.getSerialNumber());
    receipts.setArchiveNumber(receiptsDetails.getArchiveNumber());
    receipts.setDepartment(receiptsDetails.getDepartment());
    receipts.setLetterNumber(receiptsDetails.getLetterNumber());
    receipts.setLetterDate(receiptsDetails.getLetterDate());
    receipts.setSender(receiptsDetails.getSender());
    receipts.setRecipient(receiptsDetails.getRecipient());
    receipts.setSubjectType(receiptsDetails.getSubjectType());
    receipts.setRemarks(receiptsDetails.getRemarks());

    // 3. فایلونه اپډېټ یا اضافه کړه که موجود وي
    if (fileURL != null && fileURL.length > 0) {
        // 3a. موجوده فایلونه حذف کړه
        if (receipts.getAttachments() != null) {
            for (FileEntity oldFile : receipts.getAttachments()) {
                fileService.deleteFile(oldFile.getFilePath()); // د حقیقي مسیر نه فایل حذف
                fileRepository.delete(oldFile);               // DB نه حذف
            }
            receipts.getAttachments().clear();
        }

        // 3b. نوي فایلونه ذخیره کړه
        List<String> storedPaths = fileService.savefiles(fileURL, receipts); // د څو فایلونو save method

        List<FileEntity> newAttachments = new ArrayList<>();
        for (int i = 0; i < fileURL.length; i++) {
            MultipartFile f = fileURL[i];
            FileEntity fe = new FileEntity();
            fe.setFilePath(storedPaths.get(i));         // حقیقي مسیر
            fe.setFileName(f.getOriginalFilename());   // د فایل اصل نوم
            fe.setFileType(f.getContentType());        // فایل ټایپ
            fe.setReceipt(receipts);                   // د ریکارډ سره رابطه
            fileRepository.save(fe);                   // DB ته ذخیره کړه
            newAttachments.add(fe);
        }

        receipts.setAttachments(newAttachments);
    }

    // 4. وروستی ریکارډ ذخیره کړه او واپس یې کړه
    return receiptsRepository.save(receipts);
}

    public void deleteReceipt(Long id) {
        Receipts receipts = receiptsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));
        receiptsRepository.delete(receipts);
    }


public List<Receipts> searchByKeyword(String field, String keyword) {
    // keyword null یا empty وي، ټول ریکارډونه راوړه
    if (keyword == null || keyword.trim().isEmpty()) {
        return receiptsRepository.findAll();
    }

    // field null یا empty وي، default search په ټولو فیلډونو
    if (field == null || field.trim().isEmpty()) {
        return receiptsRepository
            .findBySerialNumberContainingIgnoreCaseOrArchiveNumberContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase
            (
                keyword, keyword, keyword, keyword, keyword
            );
    }

    // اوس safe ده چې switch وکاروې
    switch (field) {
        case "serialNumber":
            return receiptsRepository.findBySerialNumberContainingIgnoreCase(keyword);
        case "archiveNumber":
            return receiptsRepository.findByArchiveNumberContainingIgnoreCase(keyword);
        case "department":
            return receiptsRepository.findByDepartmentContainingIgnoreCase(keyword);
        case "recipient":
            return receiptsRepository.findByRecipientContainingIgnoreCase(keyword);
        case "sender":
            return receiptsRepository.findBySenderContainingIgnoreCase(keyword);
        default:
            return receiptsRepository
                .findBySerialNumberContainingIgnoreCaseOrArchiveNumberContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
                    keyword, keyword, keyword, keyword, keyword
                );
    }
}


}