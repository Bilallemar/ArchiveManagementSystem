package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.AttendanceBook;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.AttendanceBookRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceBookService {

    private final AttendanceBookRepository attendanceBookRepository;
    private final FileService fileService;

    public AttendanceBookService(AttendanceBookRepository attendanceBookRepository, FileService fileService) {
        this.attendanceBookRepository = attendanceBookRepository;
        this.fileService = fileService;
    }

    public AttendanceBook createAttendanceBook(AttendanceBook attendanceBook, MultipartFile fileURL) {
    attendanceBook = attendanceBookRepository.save(attendanceBook);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(fileService.savefile(fileURL,attendanceBook));

        return attendanceBook;


    }
    public List<AttendanceBook> getAllAttendanceBooks() {
        return attendanceBookRepository.findAll();
    }

    public Optional<AttendanceBook> getAttendanceBookById(Long id) {
        return attendanceBookRepository.findById(id);
    }
    @Transactional
    public AttendanceBook updateAttendanceBook(Long id, AttendanceBook attendanceBookDetails, MultipartFile[] fileURL) {
    AttendanceBook attendanceBook = attendanceBookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("AttendanceBook not found with id: " + id));

    // اصلي فیلډونه اپډېټ کړه
    attendanceBook.setProvinceOrCenter(attendanceBookDetails.getProvinceOrCenter());
    attendanceBook.setYear(attendanceBookDetails.getYear());
    attendanceBook.setSender(attendanceBookDetails.getSender());
    attendanceBook.setRecipient(attendanceBookDetails.getRecipient());
    attendanceBook.setScannedFile(attendanceBookDetails.getScannedFile());
    attendanceBook.setNumberOfVolumes(attendanceBookDetails.getNumberOfVolumes());
    attendanceBook.setCategory(attendanceBookDetails.getCategory());

    // فایل اضافه یا اپډېټ کړه
//     if (fileURL != null && fileURL.length > 0) {
//         if (attendanceBook.getAttachments() != null) {
//             attendanceBook.getAttachments().forEach(f -> fileService.deleteFile(f.getFileName()));
//             attendanceBook.getAttachments().clear();
//         }

//         fileService.savefiles(fileURL, attendanceBook);

//         List<FileEntity> attachments = new ArrayList<>();
//         for (MultipartFile file : fileURL) {
//             FileEntity fileEntity = new FileEntity();
//             fileEntity.setFilePath(file.getOriginalFilename());
//             fileEntity.setFileName(file.getOriginalFilename());
//             fileEntity.setFileType(file.getContentType());
//             fileEntity.setAttendanceBook(attendanceBook);
//             attachments.add(fileEntity);
//         }
//         attendanceBook.setAttachments(attachments);
//     }

//     return attendanceBookRepository.save(attendanceBook);
// }

    if (fileURL == null || fileURL.length == 0) {
        return attendanceBookRepository.save(attendanceBook);
    }

    // 1) Save new files and get stored paths (fileService باید paths ریټرن کړي)
    List<String> storedPaths = fileService.savefiles(fileURL, attendanceBook);

    // 2) Create FileEntity objects using real stored paths
    List<FileEntity> newAttachments = new ArrayList<>();
    for (int i = 0; i < fileURL.length; i++) {
        MultipartFile file = fileURL[i];
        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(storedPaths.get(i));          // real storage path
        fileEntity.setFileName(file.getOriginalFilename());    // original name for display
        fileEntity.setFileType(file.getContentType());
        fileEntity.setAttendanceBook(attendanceBook);
        newAttachments.add(fileEntity);
    }

    // 3) Optionally keep reference to old attachments to delete after DB save
    List<FileEntity> old = attendanceBook.getAttachments() != null ? new ArrayList<>(attendanceBook.getAttachments()) : null;

    attendanceBook.setAttachments(newAttachments);
    AttendanceBook saved = attendanceBookRepository.save(attendanceBook);

    // 4) If saved successfully, delete old physical files
    if (old != null) {
        old.forEach(o -> fileService.deleteFile(o.getFilePath()));
    }

    return saved;
}


    
    public void deleteAttendanceBook(Long id) {
        AttendanceBook attendanceBook = attendanceBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AttendanceBook not found with id: " + id));

        if (attendanceBook.getAttachments() != null) {
            attendanceBook.getAttachments().forEach(f -> fileService.deleteFile(f.getFileName()));
        }

        attendanceBookRepository.delete(attendanceBook);
    }
}
