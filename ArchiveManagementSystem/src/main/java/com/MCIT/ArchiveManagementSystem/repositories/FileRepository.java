package com.MCIT.ArchiveManagementSystem.repositories;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {

    /**
     * Find a file by its stored file path (unique filename)
     */
    Optional<FileEntity> findByFilePath(String filePath);

    /**
     * Find all files by their file paths
     */
    List<FileEntity> findAllByFilePathIn(List<String> filePaths);

    /**
     * Find all files associated with HifziyaWaradaSadera
     */
    List<FileEntity> findByHifziyaWaradaSaderaId(Integer id);

    /**
     * Find all files associated with MakzanReceipt
     */
    List<FileEntity> findByMakzanReceiptId(Integer id);

    /**
     * Find all files associated with HifziyaHazari
     */
    List<FileEntity> findByHifziyaHazariId(Integer id);

    /**
     * Find file by original filename (may return multiple if same name uploaded multiple times)
     */
    List<FileEntity> findByFileName(String fileName);

    /**
     * Check if a file exists by its path
     */
    boolean existsByFilePath(String filePath);
}