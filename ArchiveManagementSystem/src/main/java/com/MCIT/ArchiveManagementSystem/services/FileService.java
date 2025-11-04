package com.MCIT.ArchiveManagementSystem.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.AttendanceBook;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.EmpoymentOffice;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.RegistrationBook;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ResolutionsAndMemorandumsOfTheHighCouncil;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ArchiveReceivedIssuedBook;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.Receipts;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.ReceivedIssuedBook;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;
    private final Path root = Paths.get("uploads");

    // Removed @Value annotation; configure fileuploadDirectory via constructor or field assignment
    private String fileuploadDirectory = "C:/Users/IT/OneDrive/Desktop/MyProject/ArchiveFullStackProject/uploads/";

    public FileService() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }



    public Path getFile(String filename) {
        return root.resolve(filename);
    }

    public Stream<Path> listFiles() {
        try {
            return Files.walk(this.root, 1)
                    .filter(path -> !path.equals(this.root))
                    .map(this.root::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not list the files!");
        }
    }


    public void deleteFile(String filename) {
        try {
            Files.deleteIfExists(this.root.resolve(filename));
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file: " + e.getMessage());
        }
    }
// Generic method to handle file saving for different owner types and for multiple files
public <T> List<String> savefiles(MultipartFile[] files, T owner) {
    if (files == null || files.length == 0) {
        throw new IllegalArgumentException("No files provided.");
    }

    List<String> savedPaths = new ArrayList<>();

    for (MultipartFile file : files) {
        if (file.isEmpty()) continue;

        try {
            FileEntity fileEntity = new FileEntity();
            String uniqueFileName = UUID.randomUUID().toString();

            File directory = new File(fileuploadDirectory);
            if (!directory.exists() && !directory.mkdirs()) {
                throw new IOException("Failed to create directory for file uploads.");
            }

            String filePath = Paths.get(fileuploadDirectory, uniqueFileName + "_" + file.getOriginalFilename())
                    .toString();
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);
            }

            fileEntity.setFilePath(filePath);
            fileEntity.setFileName(file.getOriginalFilename());
            fileEntity.setFileType(file.getContentType());

            if (owner instanceof Receipts) {
                fileEntity.setReceipt((Receipts) owner);
            } else if (owner instanceof ReceivedIssuedBook) {
                fileEntity.setReceivedIssuedBook((ReceivedIssuedBook) owner);
            } else if (owner instanceof AttendanceBook) {
                fileEntity.setAttendanceBook((AttendanceBook) owner);
            } else if (owner instanceof EmpoymentOffice) {
                fileEntity.setEmpoymentOffice((EmpoymentOffice) owner);
            
            }  else if (owner instanceof ArchiveReceivedIssuedBook) {
                fileEntity.setArchiveReceivedIssuedBook((ArchiveReceivedIssuedBook) owner);
            } else if (owner instanceof RegistrationBook) {
                fileEntity.setRegistrationBook((RegistrationBook) owner);
            }   else if (owner instanceof ResolutionsAndMemorandumsOfTheHighCouncil) {
                fileEntity.setResolutionsAndMemorandumsOfTheHighCouncil((ResolutionsAndMemorandumsOfTheHighCouncil) owner);
            }

            
            else {
                throw new RuntimeException("Unsupported owner type");
            }

            fileRepository.save(fileEntity);
            savedPaths.add(filePath);

        } catch (IOException e) {
            throw new RuntimeException("File upload failed: " + e.getMessage(), e);
        }
    }

    return savedPaths;
}

// For single file upload, we can reuse the multiple files method
public <T> String savefile(MultipartFile file, T owner) {
    if (file == null || file.isEmpty()) {
        throw new IllegalArgumentException("File is empty or null.");
    }
    List<String> paths = savefiles(new MultipartFile[]{file}, owner);
    return paths.isEmpty() ? null : paths.get(0);
}



public Resource loadFileAsResource(String fileName) {
    try {
        Path filePath = Paths.get(fileuploadDirectory).resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if(resource.exists()) {
            return resource;
        } else {
            throw new RuntimeException("File not found " + fileName);
        }
    } catch (MalformedURLException e) {
        throw new RuntimeException("File not found " + fileName, e);
    }
}


}
