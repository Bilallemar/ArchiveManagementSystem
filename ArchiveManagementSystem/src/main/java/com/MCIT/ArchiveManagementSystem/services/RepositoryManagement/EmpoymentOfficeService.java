package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.EmpoymentOffice;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.EmpoymentOfficeRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EmpoymentOfficeService {

    private final EmpoymentOfficeRepository empoymentOfficeRepository;
    private final FileService fileService;

    public EmpoymentOfficeService(EmpoymentOfficeRepository  empoymentOfficeRepository, FileService fileService) {
        this.empoymentOfficeRepository = empoymentOfficeRepository;
        this.fileService = fileService;
    }

    public EmpoymentOffice createEmpoymentOffice(EmpoymentOffice empoymentOffice, MultipartFile fileURL) {
        empoymentOffice = empoymentOfficeRepository.save(empoymentOffice);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(fileService.savefile(fileURL,empoymentOffice));

        return empoymentOffice;


    }

    public EmpoymentOffice updateEmpoymentOffice(Long id, EmpoymentOffice empoymentOfficeDetails, MultipartFile[] fileURL) {
    EmpoymentOffice empoymentOffice = empoymentOfficeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("EmpoymentOffice not found with id: " + id));

    // اصلي فیلډونه اپډېټ کړه
    empoymentOffice.setName(empoymentOfficeDetails.getName());
    empoymentOffice.setFatherName(empoymentOfficeDetails.getFatherName());
    empoymentOffice.setNumberOfPages(empoymentOfficeDetails.getNumberOfPages());
    empoymentOffice.setSenderDate(empoymentOfficeDetails.getSenderDate());
    empoymentOffice.setRecipientDate(empoymentOfficeDetails.getRecipientDate());
    empoymentOffice.setRemarks(empoymentOfficeDetails.getRemarks());
    empoymentOffice.setFileLetterNumber(empoymentOfficeDetails.getFileLetterNumber());

    // فایل اضافه یا اپډېټ کړه
    if (fileURL != null && fileURL.length > 0) {
        if (empoymentOffice.getAttachments() != null) {
            empoymentOffice.getAttachments().forEach(f -> fileService.deleteFile(f.getFileName()));
            empoymentOffice.getAttachments().clear();
        }

        // List<String> paths = fileService.savefiles(files, empoymentOffice);
                fileService.savefiles(fileURL, empoymentOffice);


        List<FileEntity> attachments = new ArrayList<>();
        for (MultipartFile file : fileURL) {
            FileEntity fileEntity = new FileEntity();
            fileEntity.setFilePath(file.getOriginalFilename());
            fileEntity.setFileName(file.getOriginalFilename());
            fileEntity.setFileType(file.getContentType());
            fileEntity.setEmpoymentOffice(empoymentOffice);
            attachments.add(fileEntity);
        }
        empoymentOffice.setAttachments(attachments);
    }

    return empoymentOfficeRepository.save(empoymentOffice);
}

    public List<EmpoymentOffice> getAllEmpoymentOffices() {
        return empoymentOfficeRepository.findAll();
    }

    public Optional<EmpoymentOffice> getEmpoymentOfficeById(Long id) {
        return empoymentOfficeRepository.findById(id);
    }

    public void deleteEmpoymentOffice(Long id) {
        EmpoymentOffice empoymentOffice = empoymentOfficeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EmpoymentOffice not found with id: " + id));

        if (empoymentOffice.getAttachments() != null) {
            empoymentOffice.getAttachments().forEach(f -> fileService.deleteFile(f.getFileName()));
        }

        empoymentOfficeRepository.delete(empoymentOffice);
    }
}
