package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.List;
import java.util.Optional;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ArchiveReceivedIssuedBook;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.ArchiveReceivedIssuedBookRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class ArchiveReceivedIssuedBookService {

    private final FileService fileService;
    private final ArchiveReceivedIssuedBookRepository archiveReceivedIssuedBookRepository;
    private final FileRepository fileRepository;

    public ArchiveReceivedIssuedBookService(
            ArchiveReceivedIssuedBookRepository archiveReceivedIssuedBookRepository,
            FileService fileService,
            FileRepository fileRepository) {
        this.archiveReceivedIssuedBookRepository = archiveReceivedIssuedBookRepository;
        this.fileService = fileService;
        this.fileRepository = fileRepository;
    }

    public List<ArchiveReceivedIssuedBook> getAllArchiveReceivedIssuedBooks() {
        return archiveReceivedIssuedBookRepository.findAll();
    }

    public Optional<ArchiveReceivedIssuedBook> getArchiveReceivedIssuedBookById(Long id) {
        return archiveReceivedIssuedBookRepository.findById(id);
    }

    public ArchiveReceivedIssuedBook createArchiveReceivedIssuedBook(ArchiveReceivedIssuedBook book, MultipartFile fileURL) {
        book = archiveReceivedIssuedBookRepository.save(book);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(fileService.savefile(fileURL, book));
        fileEntity.setArchiveReceivedIssuedBook(book);
        fileRepository.save(fileEntity);

        return book;
    }

    public ArchiveReceivedIssuedBook updateArchiveReceivedIssuedBook(Long id, ArchiveReceivedIssuedBook bookDetails, MultipartFile fileURL) {
        ArchiveReceivedIssuedBook book = archiveReceivedIssuedBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        book.setBookNumber(bookDetails.getBookNumber());
        book.setLetterNumber(bookDetails.getLetterNumber());
        book.setSender(bookDetails.getSender());
        book.setRecipient(bookDetails.getRecipient());
        book.setIssuedDate(bookDetails.getIssuedDate());
        book.setReceivedDate(bookDetails.getReceivedDate());
        book.setSummary(bookDetails.getSummary());
        book.setSubjectType(bookDetails.getSubjectType());
        book.setRemarks(bookDetails.getRemarks());

        // فایلونه اپډېټ کول
        if (fileURL != null && !fileURL.isEmpty()) {
            if (book.getAttachments() != null) {
                for (FileEntity oldFile : book.getAttachments()) {
                    fileService.deleteFile(oldFile.getFileName());
                    fileRepository.delete(oldFile);
                }
                book.getAttachments().clear();
            }

            String filePath = fileService.savefile(fileURL, book);

            FileEntity newFileEntity = new FileEntity();
            newFileEntity.setFilePath(filePath);
            newFileEntity.setFileName(fileURL.getOriginalFilename());
            newFileEntity.setFileType(fileURL.getContentType());
            newFileEntity.setArchiveReceivedIssuedBook(book);
            fileRepository.save(newFileEntity);

            book.getAttachments().add(newFileEntity);
        }

        return archiveReceivedIssuedBookRepository.save(book);
    }

    public void deleteArchiveReceivedIssuedBook(Long id) {
        ArchiveReceivedIssuedBook book = archiveReceivedIssuedBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        archiveReceivedIssuedBookRepository.delete(book);
    }

    public List<ArchiveReceivedIssuedBook> searchByKeyword(String field, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return archiveReceivedIssuedBookRepository.findAll();
        }

        if (field == null || field.trim().isEmpty()) {
            return archiveReceivedIssuedBookRepository
                    .findByBookNumberContainingIgnoreCaseOrLetterNumberContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
                            keyword, keyword, keyword, keyword
                    );
        }

        switch (field.toLowerCase()) {
            case "booknumber":
                return archiveReceivedIssuedBookRepository.findByBookNumberContainingIgnoreCase(keyword);
            case "letternumber":
                return archiveReceivedIssuedBookRepository.findByLetterNumberContainingIgnoreCase(keyword);
            case "recipient":
                return archiveReceivedIssuedBookRepository.findByRecipientContainingIgnoreCase(keyword);
            case "sender":
                return archiveReceivedIssuedBookRepository.findBySenderContainingIgnoreCase(keyword);
            default:
                return archiveReceivedIssuedBookRepository
                        .findByBookNumberContainingIgnoreCaseOrLetterNumberContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
                                keyword, keyword, keyword, keyword
                        );
        }
    }
}
