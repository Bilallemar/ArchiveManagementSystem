package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.FileOffice;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.FileOfficeRepository;

@Service
public class FileOfficeService {
    private final FileOfficeRepository fileOfficeRepository;
    
    public FileOfficeService( FileOfficeRepository fileOfficeRepository) {
        this.fileOfficeRepository = fileOfficeRepository;

    }


    public List<FileOffice> getAllFileOffices() {
        return fileOfficeRepository.findAll();
    }
    public Optional<FileOffice> getFileOfficeById(Long id) {
        return fileOfficeRepository.findById(id);
    }
    public FileOffice createFileOffice(FileOffice fileOffice) {
        return fileOfficeRepository.save(fileOffice);
    }
    public FileOffice updateFileOffice(Long id, FileOffice fileOfficeDetails) {
        FileOffice existingDoc = fileOfficeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FileOffice not found with id: " + id));

        existingDoc.setName(fileOfficeDetails.getName());
        existingDoc.setFatherName(fileOfficeDetails.getFatherName());
        existingDoc.setRepositoryEntryRecord(fileOfficeDetails.getRepositoryEntryRecord());
        existingDoc.setFileLetterNumber(fileOfficeDetails.getFileLetterNumber());
        existingDoc.setSenderDate(fileOfficeDetails.getSenderDate());
        existingDoc.setRecipientDate(fileOfficeDetails.getRecipientDate());
        existingDoc.setRemarks(fileOfficeDetails.getRemarks());

        return fileOfficeRepository.save(existingDoc);

    }
    public void deleteFileOffice(Long id) {
        FileOffice fileOffice = fileOfficeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FileOffice not found with id: " + id));
        fileOfficeRepository.delete(fileOffice);
    }
}
