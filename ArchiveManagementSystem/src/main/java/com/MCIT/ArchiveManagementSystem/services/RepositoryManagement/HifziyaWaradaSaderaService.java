package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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


       public HifziyaWaradaSadera createHifziyaWaradaSadera(HifziyaWaradaSadera hifziyaWaradaSadera , MultipartFile fileURL) {
      hifziyaWaradaSadera= hifziyaWaradaSaderaRepository.save(hifziyaWaradaSadera);

     if (fileURL != null && !fileURL.isEmpty()) {
        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(fileService.savefile(fileURL, hifziyaWaradaSadera));
        fileEntity.setFileName(fileURL.getOriginalFilename());
        fileEntity.setFileType(fileURL.getContentType());
        fileEntity.setHifziyaWaradaSadera(hifziyaWaradaSadera);      // د ریکارډ سره تړاو
        fileRepository.save(fileEntity);            // DB ته ذخیره
        hifziyaWaradaSadera.getFiles().add(fileEntity);        // لیست ته اضافه
    }

    return hifziyaWaradaSadera;
}

   @Transactional
public HifziyaWaradaSadera updateHifziyaWaradaSadera(Integer id, HifziyaWaradaSadera hifziyaWaradaSaderaDetails, MultipartFile[] fileURL) {
    HifziyaWaradaSadera existingDoc = hifziyaWaradaSaderaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("hifziyaWaradaSadera not found with id: " + id));

    // Basic fields update
    existingDoc.setLetterNumber(hifziyaWaradaSaderaDetails.getLetterNumber());
    existingDoc.setIncommingDate(hifziyaWaradaSaderaDetails.getIncommingDate());
    existingDoc.setOutgoingDate(hifziyaWaradaSaderaDetails.getOutgoingDate());
    existingDoc.setSummary(hifziyaWaradaSaderaDetails.getSummary());
    existingDoc.setDescription(hifziyaWaradaSaderaDetails.getDescription());
    existingDoc.setIsIndraj(hifziyaWaradaSaderaDetails.getIsIndraj());

 if (fileURL != null && fileURL.length > 0) {
        // 3a. موجوده فایلونه حذف کړه
        if (existingDoc.getFiles() != null) {
            for (FileEntity oldFile : existingDoc.getFiles()) {
                fileService.deleteFile(oldFile.getFilePath()); // د حقیقي مسیر نه فایل حذف
                fileRepository.delete(oldFile);               // DB نه حذف
            }
            existingDoc.getFiles().clear();
        }

        // 3b. نوي فایلونه ذخیره کړه
        List<String> storedPaths = fileService.savefiles(fileURL, existingDoc); // د څو فایلونو save method

        List<FileEntity> newAttachments = new ArrayList<>();
        for (int i = 0; i < fileURL.length; i++) {
            MultipartFile f = fileURL[i];
            FileEntity fe = new FileEntity();
            fe.setFilePath(storedPaths.get(i));         // حقیقي مسیر
            fe.setFileName(f.getOriginalFilename());   // د فایل اصل نوم
            fe.setFileType(f.getContentType());        // فایل ټایپ
            fe.setHifziyaWaradaSadera(existingDoc);                   // د ریکارډ سره رابطه
            fileRepository.save(fe);                   // DB ته ذخیره کړه
            newAttachments.add(fe);
        }

        existingDoc.setFiles(newAttachments);
    }

    // Save updated RegistrationBook
    return hifziyaWaradaSaderaRepository.save(existingDoc);
}

    public void deleteHifziyaWaradaSadera(Integer id) {
        HifziyaWaradaSadera existingDoc = hifziyaWaradaSaderaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("hifziyaWaradaSadera not found with id: " + id));
        hifziyaWaradaSaderaRepository.delete(existingDoc);
    }
}
