package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaWaradaSaderaRepository;

import jakarta.transaction.Transactional;

@Service
public class HifziyaWaradaSaderaService {
    
    private final HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository;
    // private final FileService fileService;
    public HifziyaWaradaSaderaService( HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository ) {
        this.hifziyaWaradaSaderaRepository = hifziyaWaradaSaderaRepository;
        // this.fileService = fileService;
        
    }

    public List<HifziyaWaradaSadera> getAllHifziyaWaradaSadera() {
        return hifziyaWaradaSaderaRepository.findAll();
    }
    public Optional<HifziyaWaradaSadera> getHifziyaWaradaSaderaById(Integer id) {
        return hifziyaWaradaSaderaRepository.findById(id);
    }


       public HifziyaWaradaSadera createHifziyaWaradaSadera(HifziyaWaradaSadera hifziyaWaradaSadera ) {
      hifziyaWaradaSadera= hifziyaWaradaSaderaRepository.save(hifziyaWaradaSadera);

        // FileEntity fileEntity = new FileEntity();
        // fileEntity.setFilePath(fileService.savefile(fileURL,registrationBook));

        return hifziyaWaradaSadera;


    }
   @Transactional
public HifziyaWaradaSadera updateHifziyaWaradaSadera(Integer id, HifziyaWaradaSadera hifziyaWaradaSaderaDetails) {
    HifziyaWaradaSadera existingDoc = hifziyaWaradaSaderaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("hifziyaWaradaSadera not found with id: " + id));

    // Basic fields update
    existingDoc.setLetterNumber(hifziyaWaradaSaderaDetails.getLetterNumber());
    existingDoc.setIncommingDate(hifziyaWaradaSaderaDetails.getIncommingDate());
    existingDoc.setOutgoingDate(hifziyaWaradaSaderaDetails.getOutgoingDate());
    existingDoc.setSummary(hifziyaWaradaSaderaDetails.getSummary());
    existingDoc.setDescription(hifziyaWaradaSaderaDetails.getDescription());
    existingDoc.setIsIndraj(hifziyaWaradaSaderaDetails.getIsIndraj());

    // if (fileURL != null && fileURL.length > 0) {
    //     List<String> storedPaths = fileService.savefiles(fileURL, existingDoc);

    //     for (int i = 0; i < fileURL.length; i++) {
    //         MultipartFile file = fileURL[i];
    //         FileEntity fileEntity = new FileEntity();
    //         fileEntity.setFilePath(storedPaths.get(i));
    //         fileEntity.setFileName(file.getOriginalFilename());
    //         fileEntity.setFileType(file.getContentType());
    //         fileEntity.setRegistrationBook(existingDoc);

    //         // موجوده attachments list ته اضافه کول
    //         if (existingDoc.getAttachments() == null) {
    //             existingDoc.setAttachments(new ArrayList<>());
    //         }
    //         existingDoc.getAttachments().add(fileEntity);
    //     }
    // }

    // Save updated RegistrationBook
    return hifziyaWaradaSaderaRepository.save(existingDoc);
}

    public void deleteHifziyaWaradaSadera(Integer id) {
        HifziyaWaradaSadera existingDoc = hifziyaWaradaSaderaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("hifziyaWaradaSadera not found with id: " + id));
        hifziyaWaradaSaderaRepository.delete(existingDoc);
    }
}
