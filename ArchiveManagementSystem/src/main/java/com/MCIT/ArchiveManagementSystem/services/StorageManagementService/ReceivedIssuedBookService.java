package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;


import java.util.List;
import java.util.Optional;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.ReceivedIssuedBook;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.ReceivedIssuedBookRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class ReceivedIssuedBookService {

    

    private final FileService fileService;

    private final ReceivedIssuedBookRepository receivedIssuedBookRepository;
    private final FileRepository fileRepository;


    public ReceivedIssuedBookService(ReceivedIssuedBookRepository receivedIssuedBookRepository, FileService fileService,
                           FileRepository fileRepository) {
        this.receivedIssuedBookRepository = receivedIssuedBookRepository;
        this.fileService = fileService;
        this.fileRepository = fileRepository;

    }

    public List<ReceivedIssuedBook> getAllBooks() {
        return receivedIssuedBookRepository.findAll();
    }

    public Optional<ReceivedIssuedBook> getBookById(Long id) {
        return receivedIssuedBookRepository.findById(id);
    }

    public ReceivedIssuedBook createBook(ReceivedIssuedBook receivedIssuedBook ,MultipartFile fileURL)  {
        receivedIssuedBook = receivedIssuedBookRepository.save(receivedIssuedBook);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(fileService.savefile(fileURL,receivedIssuedBook));

        return receivedIssuedBook;
    }

    public ReceivedIssuedBook updateBook(Long id, ReceivedIssuedBook  bookDetails, MultipartFile fileURL) {
        ReceivedIssuedBook  receivedIssuedBook = receivedIssuedBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

        receivedIssuedBook.setBookNumber(bookDetails.getBookNumber());
        receivedIssuedBook.setLetterNumber(bookDetails.getLetterNumber());
        receivedIssuedBook.setSender(bookDetails.getSender());
        receivedIssuedBook.setRecipient(bookDetails.getRecipient());
        receivedIssuedBook.setIssuedDate(bookDetails.getIssuedDate());
        receivedIssuedBook.setReceivedDate(bookDetails.getReceivedDate());
        receivedIssuedBook.setSummary(bookDetails.getSummary());
        receivedIssuedBook.setSubjectType(bookDetails.getSubjectType());
        receivedIssuedBook.setRemarks(bookDetails.getRemarks());

      if (fileURL != null && !fileURL.isEmpty()) {
            // Delete existing files both from file system and DB
            if (receivedIssuedBook.getAttachments() != null) {
                for (FileEntity oldFile : receivedIssuedBook.getAttachments()) {
                    fileService.deleteFile(oldFile.getFileName());
                    fileRepository.delete(oldFile);
                }
                receivedIssuedBook.getAttachments().clear();
            }

            // Save new file
            String filePath = fileService.savefile(fileURL, receivedIssuedBook);

            FileEntity newFileEntity = new FileEntity();
            newFileEntity.setFilePath(filePath);
            newFileEntity.setFileName(fileURL.getOriginalFilename());
            newFileEntity.setFileType(fileURL.getContentType());
            newFileEntity.setReceivedIssuedBook(receivedIssuedBook);
            fileRepository.save(newFileEntity);

            receivedIssuedBook.getAttachments().add(newFileEntity);
        }

        return receivedIssuedBookRepository.save(receivedIssuedBook);
    }

    public void deleteBook(Long id) {
        ReceivedIssuedBook  book = receivedIssuedBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));
        receivedIssuedBookRepository.delete(book);
    }


public List<ReceivedIssuedBook> searchByKeyword(String field, String keyword) {
    // keyword null یا empty وي، ټول ریکارډونه راوړه
    if (keyword == null || keyword.trim().isEmpty()) {
        return receivedIssuedBookRepository.findAll();
    }

    // field null یا empty وي، default search په ټولو فیلډونو
    if (field == null || field.trim().isEmpty()) {
        return receivedIssuedBookRepository
            .findByBookNumberContainingIgnoreCaseOrLetterNumberContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
                keyword, keyword, keyword, keyword
            );
    }

    // اوس safe ده چې switch وکاروې
    switch (field) {
        case "booknumber":
            return receivedIssuedBookRepository. findByBookNumberContainingIgnoreCase(keyword);

        case "":
            return receivedIssuedBookRepository.findByLetterNumberContainingIgnoreCase(keyword);
        case "recipient":
            return receivedIssuedBookRepository.findByRecipientContainingIgnoreCase(keyword);
        case "sender":
            return receivedIssuedBookRepository.findBySenderContainingIgnoreCase(keyword);
        default:
            return receivedIssuedBookRepository
                .findByBookNumberContainingIgnoreCaseOrLetterNumberContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
                    keyword, keyword, keyword, keyword
                );
    }
}


}