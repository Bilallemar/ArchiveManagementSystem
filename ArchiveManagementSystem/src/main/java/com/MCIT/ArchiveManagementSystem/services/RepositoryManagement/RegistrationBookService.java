package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.RegistrationBook;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.RegistrationBookRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;

import jakarta.transaction.Transactional;

@Service
public class RegistrationBookService {
    
    private final RegistrationBookRepository registrationBookRepository;
    private final FileService fileService;
    public RegistrationBookService( RegistrationBookRepository registrationBookRepository ,FileService fileService) {
        this.registrationBookRepository = registrationBookRepository;
        this.fileService = fileService;
        
    }

    public List<RegistrationBook> getAllRegistrationBooks() {
        return registrationBookRepository.findAll();
    }
    public Optional<RegistrationBook> getRegistrationBookById(Long id) {
        return registrationBookRepository.findById(id);
    }


       public RegistrationBook createRegistrationBook(RegistrationBook registrationBook, MultipartFile fileURL) {
      registrationBook= registrationBookRepository.save(registrationBook);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(fileService.savefile(fileURL,registrationBook));

        return registrationBook;


    }
   @Transactional
public RegistrationBook updateRegistrationBook(Long id, RegistrationBook registrationBookDetails, MultipartFile[] fileURL) {
    RegistrationBook existingDoc = registrationBookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("RegistrationBook not found with id: " + id));

    // Basic fields update
    existingDoc.setProvinceOrCenter(registrationBookDetails.getProvinceOrCenter());
    existingDoc.setYear(registrationBookDetails.getYear());
    existingDoc.setSender(registrationBookDetails.getSender());
    existingDoc.setRecipient(registrationBookDetails.getRecipient());
    existingDoc.setScannedFile(registrationBookDetails.getScannedFile());
    existingDoc.setNumberOfVolumes(registrationBookDetails.getNumberOfVolumes());
    existingDoc.setCategory(registrationBookDetails.getCategory());

    if (fileURL != null && fileURL.length > 0) {
        List<String> storedPaths = fileService.savefiles(fileURL, existingDoc);

        for (int i = 0; i < fileURL.length; i++) {
            MultipartFile file = fileURL[i];
            FileEntity fileEntity = new FileEntity();
            fileEntity.setFilePath(storedPaths.get(i));
            fileEntity.setFileName(file.getOriginalFilename());
            fileEntity.setFileType(file.getContentType());
            fileEntity.setRegistrationBook(existingDoc);

            // موجوده attachments list ته اضافه کول
            if (existingDoc.getAttachments() == null) {
                existingDoc.setAttachments(new ArrayList<>());
            }
            existingDoc.getAttachments().add(fileEntity);
        }
    }

    // Save updated RegistrationBook
    return registrationBookRepository.save(existingDoc);
}

    public void deleteRegistrationBook(Long id) {
        RegistrationBook existingDoc = registrationBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RegistrationBook not found with id: " + id));
        registrationBookRepository.delete(existingDoc);
    }
}
