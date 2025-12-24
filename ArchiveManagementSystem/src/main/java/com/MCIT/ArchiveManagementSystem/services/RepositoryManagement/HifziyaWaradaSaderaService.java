package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaWaradaSaderaRepository;

import jakarta.transaction.Transactional;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;

@Service
public class HifziyaWaradaSaderaService {
        private static final Logger logger = LoggerFactory.getLogger(HifziyaWaradaSaderaService.class);

    private final HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository;
    private final FileRepository fileRepository;
    private final FileService fileService;
    // private final FileService fileService;
    public HifziyaWaradaSaderaService( HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository, FileRepository fileRepository, FileService fileService) {
        this.hifziyaWaradaSaderaRepository = hifziyaWaradaSaderaRepository;
        this.fileRepository = fileRepository;
        this.fileService = fileService;
        
    }

    public List<HifziyaWaradaSadera> getAllHifziyaWaradaSadera() {
        return hifziyaWaradaSaderaRepository.findAll();
    }
    public Optional<HifziyaWaradaSadera> getHifziyaWaradaSaderaById(Integer id) {
        return hifziyaWaradaSaderaRepository.findById(id);
    }


@Transactional
public HifziyaWaradaSadera createHifziyaWaradaSadera(HifziyaWaradaSadera hifziyaWaradaSadera, MultipartFile fileURL) {
    
    // Save the main entity first (without files)
    HifziyaWaradaSadera savedEntity = hifziyaWaradaSaderaRepository.save(hifziyaWaradaSadera);
    
    if (fileURL != null && !fileURL.isEmpty()) {
        try {
            // This already saves the file to disk AND database
            fileService.savefile(fileURL, savedEntity);
            
            // NO NEED TO SAVE AGAIN - remove all the code below!
            // The fileService.savefile() already handled everything
            
        } catch (Exception e) {
            logger.error("Failed to save file: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save file: " + e.getMessage(), e);
        }
    }
    
    return savedEntity;
}

 @Transactional
public HifziyaWaradaSadera updateHifziyaWaradaSadera(Integer id, HifziyaWaradaSadera hifziyaWaradaSaderaDetails, MultipartFile[] fileURL) {

    HifziyaWaradaSadera existingDoc = hifziyaWaradaSaderaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("HifziyaWaradaSadera not found with id: " + id));

    // ---- Basic field updates ----
    existingDoc.setLetterNumber(hifziyaWaradaSaderaDetails.getLetterNumber());
    existingDoc.setIncommingDate(hifziyaWaradaSaderaDetails.getIncommingDate());
    existingDoc.setOutgoingDate(hifziyaWaradaSaderaDetails.getOutgoingDate());
    existingDoc.setSummary(hifziyaWaradaSaderaDetails.getSummary());
    existingDoc.setDescription(hifziyaWaradaSaderaDetails.getDescription());
    existingDoc.setIsHifziya(hifziyaWaradaSaderaDetails.getIsHifziya());
    
    // Update other fields if they exist
    if (hifziyaWaradaSaderaDetails.getNo() != null) {
        existingDoc.setNo(hifziyaWaradaSaderaDetails.getNo());
    }
    if (hifziyaWaradaSaderaDetails.getOrg() != null) {
        existingDoc.setOrg(hifziyaWaradaSaderaDetails.getOrg());
    }

    // ---- File Updates ----
    if (fileURL != null && fileURL.length > 0) {

        // Remove existing files
        if (existingDoc.getFiles() != null && !existingDoc.getFiles().isEmpty()) {
            // Create a copy to avoid ConcurrentModificationException
            List<FileEntity> filesToDelete = new ArrayList<>(existingDoc.getFiles());
            
            for (FileEntity oldFile : filesToDelete) {
                try {
                    // Delete from database first
                    fileRepository.delete(oldFile);
                    // Then try to delete from disk
                    fileService.deleteFile(oldFile.getFilePath());
                } catch (Exception e) {
                    logger.warn("Could not delete file: {}", oldFile.getFilePath(), e);
                }
            }

            existingDoc.getFiles().clear();
        }

        // Save new uploaded files - let fileService handle everything
        try {
            // This method should handle both disk storage and database save
            fileService.savefiles(fileURL, existingDoc);
            
            // Refresh the entity to get the new files
            existingDoc = hifziyaWaradaSaderaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Failed to refresh entity after file upload"));
            
        } catch (Exception e) {
            logger.error("Failed to upload new files", e);
            throw new RuntimeException("Failed to upload new files: " + e.getMessage(), e);
        }
    }

    return hifziyaWaradaSaderaRepository.save(existingDoc);
}

    public void deleteHifziyaWaradaSadera(Integer id) {
        HifziyaWaradaSadera existingDoc = hifziyaWaradaSaderaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("hifziyaWaradaSadera not found with id: " + id));
        hifziyaWaradaSaderaRepository.delete(existingDoc);
    }
}
