package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ResolutionsAndMemorandumsOfTheHighCouncil;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.ResolutionsAndMemorandumsOfTheHighCouncilRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;

import jakarta.transaction.Transactional;

@Service
public class ResolutionsAndMemorandumsOfTheHighCouncilService {
    
    private final ResolutionsAndMemorandumsOfTheHighCouncilRepository resolutionsAndMemorandumsOfTheHighCouncilRepository;
    private final FileService fileService;
    public ResolutionsAndMemorandumsOfTheHighCouncilService( ResolutionsAndMemorandumsOfTheHighCouncilRepository resolutionsAndMemorandumsOfTheHighCouncilRepository ,FileService fileService) {
        this.resolutionsAndMemorandumsOfTheHighCouncilRepository = resolutionsAndMemorandumsOfTheHighCouncilRepository;
        this.fileService = fileService;
        
    }

    public List<ResolutionsAndMemorandumsOfTheHighCouncil> getAllRMHC() {
        return resolutionsAndMemorandumsOfTheHighCouncilRepository.findAll();
    }
    public Optional<ResolutionsAndMemorandumsOfTheHighCouncil> getRMHCById(Long id) {
        return resolutionsAndMemorandumsOfTheHighCouncilRepository.findById(id);
    }


       public ResolutionsAndMemorandumsOfTheHighCouncil createRMHC(ResolutionsAndMemorandumsOfTheHighCouncil resolutionsAndMemorandumsOfTheHighCouncil, MultipartFile fileURL) {
      resolutionsAndMemorandumsOfTheHighCouncil= resolutionsAndMemorandumsOfTheHighCouncilRepository.save(resolutionsAndMemorandumsOfTheHighCouncil);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(fileService.savefile(fileURL,resolutionsAndMemorandumsOfTheHighCouncil));

        return resolutionsAndMemorandumsOfTheHighCouncil;


    }
   @Transactional
public ResolutionsAndMemorandumsOfTheHighCouncil updateRMHC(Long id, ResolutionsAndMemorandumsOfTheHighCouncil resolutionsAndMemorandumsOfTheHighCouncilDetails, MultipartFile[] fileURL) {
    ResolutionsAndMemorandumsOfTheHighCouncil existingDoc = resolutionsAndMemorandumsOfTheHighCouncilRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("RegistrationBook not found with id: " + id));

    // Basic fields update
    existingDoc.setBookNumber(resolutionsAndMemorandumsOfTheHighCouncilDetails.getBookNumber());
    existingDoc.setSerialNumber(resolutionsAndMemorandumsOfTheHighCouncilDetails.getSerialNumber());
    existingDoc.setSender(resolutionsAndMemorandumsOfTheHighCouncilDetails.getSender());
    existingDoc.setSenderDate(resolutionsAndMemorandumsOfTheHighCouncilDetails.getSenderDate());
    existingDoc.setSubject(resolutionsAndMemorandumsOfTheHighCouncilDetails.getSubject());
    existingDoc.setLetterNumber(resolutionsAndMemorandumsOfTheHighCouncilDetails.getLetterNumber());
    existingDoc.setYearOfApproval(resolutionsAndMemorandumsOfTheHighCouncilDetails.getYearOfApproval());
    existingDoc.setRemarks(resolutionsAndMemorandumsOfTheHighCouncilDetails.getRemarks());


    if (fileURL != null && fileURL.length > 0) {
        List<String> storedPaths = fileService.savefiles(fileURL, existingDoc);

        for (int i = 0; i < fileURL.length; i++) {
            MultipartFile file = fileURL[i];
            FileEntity fileEntity = new FileEntity();
            fileEntity.setFilePath(storedPaths.get(i));
            fileEntity.setFileName(file.getOriginalFilename());
            fileEntity.setFileType(file.getContentType());
            fileEntity.setResolutionsAndMemorandumsOfTheHighCouncil(existingDoc);

            //  ته اضافه کول list  attachments  موجوده 
            if (existingDoc.getAttachments() == null) {
                existingDoc.setAttachments(new ArrayList<>());
            }
            existingDoc.getAttachments().add(fileEntity);
        }
    }

    // Save updated RMHC
    return resolutionsAndMemorandumsOfTheHighCouncilRepository.save(existingDoc);
}

    public void deleteRMHC(Long id) {
        ResolutionsAndMemorandumsOfTheHighCouncil existingDoc = resolutionsAndMemorandumsOfTheHighCouncilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RegistrationBook not found with id: " + id));
        resolutionsAndMemorandumsOfTheHighCouncilRepository.delete(existingDoc);
    }
}
