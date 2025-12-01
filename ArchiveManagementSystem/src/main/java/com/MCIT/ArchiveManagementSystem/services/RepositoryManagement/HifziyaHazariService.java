package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaHazariRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;

import jakarta.transaction.Transactional;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;

@Service
public class HifziyaHazariService {
    private final HifziyaHazariRepository hifziyaHazariRepository;
    private final FileService fileService;
    private final FileRepository fileRepository;
    
    public HifziyaHazariService( HifziyaHazariRepository hifziyaHazariRepository, FileService fileService, FileRepository fileRepository) {
        this.hifziyaHazariRepository = hifziyaHazariRepository;
        this.fileService = fileService;
        this.fileRepository = fileRepository;

    }


    public List<HifziyaHazari> getAllHifziyaHazaris() {
        return hifziyaHazariRepository.findAll();
    }
    public Optional<HifziyaHazari> getHifziyaHazariById(Integer id) {
        return hifziyaHazariRepository.findById(id);
    }
//     public HifziyaHazari createHifziyaHazari(HifziyaHazari hifziyaHazari, MultipartFile fileURL) {
//   hifziyaHazari = hifziyaHazariRepository.save(hifziyaHazari);

//     // 2. که فایل موجود وي، ذخیره یې کړه
//     if (fileURL != null && !fileURL.isEmpty()) {
//         FileEntity fileEntity = new FileEntity();
//         fileEntity.setFilePath(fileService.savefile(fileURL, hifziyaHazari));
//         fileEntity.setFileName(fileURL.getOriginalFilename());
//         fileEntity.setFileType(fileURL.getContentType());
//         fileEntity.setHifziyaHazari(hifziyaHazari);      // د ریکارډ سره تړاو
//         fileRepository.save(fileEntity);            // DB ته ذخیره
//         hifziyaHazari.getFiles().add(fileEntity);        // لیست ته اضافه
//     }

//     return hifziyaHazari;
//     }
public HifziyaHazari createHifziyaHazari(HifziyaHazari hifziyaHazari, MultipartFile fileURL) {
    // 🔹 ډیباګ: چاپ کړئ د ریکارډ معلومات
    System.out.println("Saving HifziyaHazari: " + hifziyaHazari);

    hifziyaHazari = hifziyaHazariRepository.save(hifziyaHazari);

    // که فایل موجود وي، ذخیره یې کړه
    if (fileURL != null && !fileURL.isEmpty()) {
        System.out.println("Saving file: " + fileURL.getOriginalFilename());
        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(fileService.savefile(fileURL, hifziyaHazari));
        fileEntity.setFileName(fileURL.getOriginalFilename());
        fileEntity.setFileType(fileURL.getContentType());
        fileEntity.setHifziyaHazari(hifziyaHazari);
        fileRepository.save(fileEntity);
        hifziyaHazari.getFiles().add(fileEntity);
    } else {
        System.out.println("No file to save in Service");
    }

    return hifziyaHazari;
}

       @Transactional
    public HifziyaHazari updateHifziyaHazari(Integer id, HifziyaHazari hifziyaHazariDetails, MultipartFile[] fileURL) {
        HifziyaHazari existingDoc = hifziyaHazariRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FileOffice not found with id: " + id));

        existingDoc.setType(hifziyaHazariDetails.getType());
        existingDoc.setYear(hifziyaHazariDetails.getYear());
        existingDoc.setOrg(hifziyaHazariDetails.getOrg());
        existingDoc.setDescription(hifziyaHazariDetails.getDescription());
        existingDoc.setIsIndraj(hifziyaHazariDetails.getIsIndraj());
    // 3. فایلونه اپډېټ یا اضافه کړه که موجود وي
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
            fe.setHifziyaHazari(existingDoc);                   // د ریکارډ سره رابطه
            fileRepository.save(fe);                   // DB ته ذخیره کړه
            newAttachments.add(fe);
        }

        existingDoc.setFiles(newAttachments);
    }
        return hifziyaHazariRepository.save(existingDoc);

    }
    public void deleteHifziyaHazari(Integer id) {
        HifziyaHazari fileOffice = hifziyaHazariRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FileOffice not found with id: " + id));
        hifziyaHazariRepository.delete(fileOffice);
    }
}
