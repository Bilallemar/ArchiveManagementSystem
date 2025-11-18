package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.List;
import java.util.Optional;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.SawanihRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class SawanihService {

    private final SawanihRepository sawanihRepository;

    public SawanihService(
            SawanihRepository sawanihRepository) {
        this.sawanihRepository = sawanihRepository;
    
    }

    public List<Sawanih> getAllSawanihs() {
        return sawanihRepository.findAll();
    }

    public Optional<Sawanih> getSawanihById(Integer id) {
        return sawanihRepository.findById(id);
    }

    public Sawanih createSawanih(Sawanih book, MultipartFile fileURL) {
        book = sawanihRepository.save(book);

        // FileEntity fileEntity = new FileEntity();
        // fileEntity.setFilePath(fileService.savefile(fileURL, book));
        // fileEntity.setSawanih(book);
        // fileRepository.save(fileEntity);

        return book;
    }

    public Sawanih updateSawanih(Integer id, Sawanih bookDetails, MultipartFile fileURL) {
        Sawanih book = sawanihRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        book.setName(bookDetails.getName());
        book.setFatherName(bookDetails.getFatherName());
        book.setQaidWarida(bookDetails.getQaidWarida());
        book.setIncommingDate(bookDetails.getIncommingDate());
        book.setOutgoingDate(bookDetails.getOutgoingDate());
        book.setOrg(bookDetails.getOrg());
        book.setPageQuantity(bookDetails.getPageQuantity());
        book.setDescription(bookDetails.getDescription());
        book.setIsIndraj(bookDetails.getIsIndraj());


        // فایلونه اپډېټ کول
        // if (fileURL != null && !fileURL.isEmpty()) {
        //     if (book.getAttachments() != null) {
        //         for (FileEntity oldFile : book.getAttachments()) {
        //             fileService.deleteFile(oldFile.getFileName());
        //             fileRepository.delete(oldFile);
        //         }
        //         book.getAttachments().clear();
        //     }

        //     String filePath = fileService.savefile(fileURL, book);

        //     FileEntity newFileEntity = new FileEntity();
        //     newFileEntity.setFilePath(filePath);
        //     newFileEntity.setFileName(fileURL.getOriginalFilename());
        //     newFileEntity.setFileType(fileURL.getContentType());
        //     newFileEntity.setSawanih(book);
        //     fileRepository.save(newFileEntity);

        //     book.getAttachments().add(newFileEntity);
        // }

        return sawanihRepository.save(book);
    }

    public void deleteSawanih(Integer id) {
        Sawanih book = sawanihRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        sawanihRepository.delete(book);
    }

    // public List<Sawanih> searchByKeyword(String field, String keyword) {
    //     if (keyword == null || keyword.trim().isEmpty()) {
    //         return sawanihRepository.findAll();
    //     }

    //     if (field == null || field.trim().isEmpty()) {
    //         return sawanihRepository
    //                 .findByBookNumberContainingIgnoreCaseOrLetterNumberContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
    //                         keyword, keyword, keyword, keyword
    //                 );
    //     }

    //     switch (field.toLowerCase()) {
    //         case "booknumber":
    //             return sawanihRepository.findByBookNumberContainingIgnoreCase(keyword);
    //         case "letternumber":
    //             return sawanihRepository.findByLetterNumberContainingIgnoreCase(keyword);
    //         case "recipient":
    //             return sawanihRepository.findByRecipientContainingIgnoreCase(keyword);
    //         case "sender":
    //             return sawanihRepository.findBySenderContainingIgnoreCase(keyword);
    //         default:
    //             return sawanihRepository
    //                     .findByBookNumberContainingIgnoreCaseOrLetterNumberContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
    //                             keyword, keyword, keyword, keyword
    //                     );
    //     }
    // }
}
