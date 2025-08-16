package com.MCIT.ArchiveManagementSystem.services;


import java.util.List;
import java.util.Optional;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Receipts;
import com.MCIT.ArchiveManagementSystem.repositories.ReceiptsRepository;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;


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

    public Receipts updateReceipt(Long id, Receipts receiptsDetails, MultipartFile fileURL) {
        Receipts receipts = receiptsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

        receipts.setSerialNumber(receiptsDetails.getSerialNumber());
        receipts.setArchiveNumber(receiptsDetails.getArchiveNumber());
        receipts.setDepartment(receiptsDetails.getDepartment());
        receipts.setLetterNumber(receiptsDetails.getLetterNumber());
        receipts.setLetterDate(receiptsDetails.getLetterDate());
        receipts.setSender(receiptsDetails.getSender());
        receipts.setRecipient(receiptsDetails.getRecipient());
        receipts.setSubjectType(receiptsDetails.getSubjectType());
        receipts.setRemarks(receiptsDetails.getRemarks());

      if (fileURL != null && !fileURL.isEmpty()) {
            // Delete existing files both from file system and DB
            if (receipts.getAttachments() != null) {
                for (FileEntity oldFile : receipts.getAttachments()) {
                    fileService.deleteFile(oldFile.getFileName());
                    fileRepository.delete(oldFile);
                }
                receipts.getAttachments().clear();
            }

            // Save new file
            String filePath = fileService.savefile(fileURL, receipts);

            FileEntity newFileEntity = new FileEntity();
            newFileEntity.setFilePath(filePath);
            newFileEntity.setFileName(fileURL.getOriginalFilename());
            newFileEntity.setFileType(fileURL.getContentType());
            newFileEntity.setReceipt(receipts);
            fileRepository.save(newFileEntity);

            receipts.getAttachments().add(newFileEntity);
        }

        return receiptsRepository.save(receipts);
    }

    public void deleteReceipt(Long id) {
        Receipts receipts = receiptsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));
        receiptsRepository.delete(receipts);
    }


  public List<Receipts> searchByKeyword(String keyword) {
    if (keyword == null || keyword.isEmpty()) {
        return receiptsRepository.findAll(); // که keyword خالي وي، ټول ریکارډونه راوړه
    }
    return receiptsRepository.findBySerialNumberContainingIgnoreCaseOrArchiveNumberContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
        keyword, keyword, keyword, keyword, keyword
    );
}

}