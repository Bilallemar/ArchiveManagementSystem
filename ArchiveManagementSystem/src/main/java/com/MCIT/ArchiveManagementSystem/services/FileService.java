package com.MCIT.ArchiveManagementSystem.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.Receipts;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.ReceivedIssuedBook;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
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

    public String savefile(MultipartFile file, Receipts receipts) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null.");
        }

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
            fileEntity.setFileName(filePath.substring(filePath.lastIndexOf(File.separator) + 1));
            fileEntity.setFileType(filePath.substring(filePath.lastIndexOf(".") + 1));
            fileEntity.setReceipt(receipts);
            // fileEntity.setReceivedIssuedBook(book);
            fileRepository.save(fileEntity);

            return filePath;
        } catch (IOException e) {
        throw new RuntimeException("File upload failed: " + e.getMessage(), e);
    }
}
public String savefile(MultipartFile file, ReceivedIssuedBook receivedIssuedBook) {
    if (file == null || file.isEmpty()) {
        throw new IllegalArgumentException("File is empty or null.");
    }

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
        fileEntity.setFileName(filePath.substring(filePath.lastIndexOf(File.separator) + 1));
        fileEntity.setFileType(filePath.substring(filePath.lastIndexOf(".") + 1));
        fileEntity.setReceivedIssuedBook(receivedIssuedBook);  // دلته د ReceivedIssuedBook سره تړاو
        fileRepository.save(fileEntity);

        return filePath;
    } catch (IOException e) {
        throw new RuntimeException("File upload failed: " + e.getMessage(), e);
    }
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
