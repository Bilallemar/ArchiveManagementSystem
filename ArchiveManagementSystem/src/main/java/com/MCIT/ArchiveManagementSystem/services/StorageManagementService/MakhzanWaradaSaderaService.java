package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.dtos.MakhzanWaradaSaderaSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakhzanWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.enums.MakhzanWaradaSaderaDirection;
import com.MCIT.ArchiveManagementSystem.repositories.AuditLogRepository;
import com.MCIT.ArchiveManagementSystem.repositories.FileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakhzanWaradaSaderaRepository;
import com.MCIT.ArchiveManagementSystem.services.FileService;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

import jakarta.transaction.Transactional;

@Service
public class MakhzanWaradaSaderaService {
    @Value("${spring.file.directory}") // ✅ add this
    private String uploadDir;

    @Value("${scanner.folder.path}") // ✅ add this
    private String scannerFolderPath;
    private static final Logger logger = LoggerFactory.getLogger(MakhzanWaradaSaderaService.class);
    private static final String TABLE_NAME = "MakhzanWaradaSadera";

    private final MakhzanWaradaSaderaRepository repository;
    private final FileRepository fileRepository;
    private final FileService fileService;
    private final AuditLogHelper auditLogHelper;

    public MakhzanWaradaSaderaService(
            MakhzanWaradaSaderaRepository repository,
            FileRepository fileRepository,
            FileService fileService,
            AuditLogRepository auditLogRepository,
            AuditLogHelper auditLogHelper) {

        this.repository = repository;
        this.fileRepository = fileRepository;
        this.fileService = fileService;
        this.auditLogHelper = auditLogHelper;
    }

    // public List<MakhzanWaradaSadera> getAll() {
    // return repository.findAll();
    // }
    public Page<MakhzanWaradaSaderaSummaryDTO> getAll(
            Management management,
            String direction,
            String field,
            String term,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        String cleanTerm = (term == null) ? "" : term.trim();

        // Convert String → enum
        MakhzanWaradaSaderaDirection directionEnum = null;
        if (direction != null && !direction.isBlank()) {
            directionEnum = MakhzanWaradaSaderaDirection.valueOf(direction.toUpperCase());
        }

        Page<MakhzanWaradaSadera> raw = repository.searchMakhzanWaradaSadera(
                management, directionEnum, field, cleanTerm, pageable); // ← directionEnum not cleanDirection

        return raw.map(a -> new MakhzanWaradaSaderaSummaryDTO(
                a.getId(),
                a.getLetterNumber(),
                a.getIncommingDate(),
                a.getSubjectType(),
                a.getSenderOrg() != null ? a.getSenderOrg().getName() : null, // ← senderOrgName
                a.getReceiverOrg() != null ? a.getReceiverOrg().getName() : null, // ← receiverOrgName
                a.getDirection() != null ? a.getDirection().name() : null));
    }

    public Optional<MakhzanWaradaSadera> getById(Integer id) {
        return repository.findById(id);
    }

    @Transactional
    public MakhzanWaradaSadera create(MakhzanWaradaSadera entity, MultipartFile[] fileURL,
            List<String> scannerFileNames) {

        entity = repository.save(entity);
        List<FileEntity> files = new ArrayList<>();

        if (fileURL != null && fileURL.length > 0) {
            List<String> storedPaths = fileService.savefiles(fileURL, entity);

            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];

                FileEntity fe = new FileEntity();
                fe.setFileName(file.getOriginalFilename());
                fe.setFileType(file.getContentType());
                fe.setFilePath(storedPaths.get(i));
                fe.setMakhzanWaradaSadera(entity);

                fileRepository.save(fe);
                files.add(fe);
            }
        }
        if (scannerFileNames != null && !scannerFileNames.isEmpty()) {
            for (String scannerFileName : scannerFileNames) {
                try {
                    Path sourcePath = Paths.get(scannerFolderPath, scannerFileName);
                    String uniqueName = UUID.randomUUID() + "_" + scannerFileName;
                    Path destPath = Paths.get(uploadDir, uniqueName);

                    Files.createDirectories(Paths.get(uploadDir));
                    Files.copy(sourcePath, destPath, StandardCopyOption.REPLACE_EXISTING);

                    String fileType = Files.probeContentType(sourcePath);

                    FileEntity fe = new FileEntity();
                    fe.setFilePath(uniqueName);
                    fe.setFileName(scannerFileName);
                    fe.setFileType(fileType != null ? fileType : "application/octet-stream");
                    fe.setFileSize(Files.size(sourcePath));
                    fe.setMakhzanWaradaSadera(entity);
                    fileRepository.save(fe);
                    files.add(fe);
                    System.out.println("✅ Scanner file copied: " + scannerFileName);

                } catch (java.io.IOException e) { // ✅ fully qualified to be safe
                    System.err.println("❌ Failed to copy scanner file: "
                            + scannerFileName + " - " + e.getMessage());
                }
            }
        }

        entity.setFiles(files);

        auditLogHelper.logCreate(TABLE_NAME, entity.getId().longValue(), entity.getDescription());
        return entity;
    }

    @Transactional
    public MakhzanWaradaSadera updateMakhzanWaradaSadera(Integer id,
            MakhzanWaradaSadera makhzanWaradaSaderaDetails,
            MultipartFile[] fileURL,
            List<String> scannerFileNames) {

        MakhzanWaradaSadera existingDoc = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("MakhzanWaradaSadera not found with id: " + id));

        logger.info("Updating MakhzanWaradaSadera id: {}", id);

        // Update basic fields existing.setNo(details.getNo());
        existingDoc.setNo(makhzanWaradaSaderaDetails.getNo());
        existingDoc.setSenderOrg(makhzanWaradaSaderaDetails.getSenderOrg());
        existingDoc.setReceiverOrg(makhzanWaradaSaderaDetails.getReceiverOrg());

        existingDoc.setLetterNumber(makhzanWaradaSaderaDetails.getLetterNumber());
        existingDoc.setIncommingDate(makhzanWaradaSaderaDetails.getIncommingDate());
        existingDoc.setOutgoingDate(makhzanWaradaSaderaDetails.getOutgoingDate());
        existingDoc.setSenderOrgDate(makhzanWaradaSaderaDetails.getSenderOrgDate());
        existingDoc.setSummary(makhzanWaradaSaderaDetails.getSummary());
        existingDoc.setSubjectType(makhzanWaradaSaderaDetails.getSubjectType());
        existingDoc.setDescription(makhzanWaradaSaderaDetails.getDescription());
        existingDoc.setDirection(makhzanWaradaSaderaDetails.getDirection());
        existingDoc.setCabinetFile(makhzanWaradaSaderaDetails.getCabinetFile());

        boolean hasNewFiles = (fileURL != null && fileURL.length > 0);
        boolean hasScannerFiles = (scannerFileNames != null && !scannerFileNames.isEmpty());

        if (hasNewFiles || hasScannerFiles) {
            // ✅ Delete old files from disk and DB
            if (existingDoc.getFiles() != null && !existingDoc.getFiles().isEmpty()) {
                for (FileEntity oldFile : existingDoc.getFiles()) {
                    fileService.deleteFile(oldFile.getFilePath());
                    fileRepository.delete(oldFile);
                }
                existingDoc.getFiles().clear();
                fileRepository.flush();
            }
        }

        // ── Handle manual uploaded files ──────────────────────
        if (hasNewFiles) {
            List<String> storedPaths = fileService.savefiles(fileURL, existingDoc);
            for (int i = 0; i < fileURL.length; i++) {
                MultipartFile file = fileURL[i];
                if (file == null || file.isEmpty())
                    continue;

                FileEntity fe = new FileEntity();
                fe.setFilePath(storedPaths.get(i));
                fe.setFileName(file.getOriginalFilename()); // ✅ keep original name
                fe.setFileType(file.getContentType());
                fe.setFileSize(file.getSize());
                fe.setMakhzanWaradaSadera(existingDoc);
                fileRepository.save(fe);
                existingDoc.getFiles().add(fe);
                System.out.println("✅ Manual file saved on update: " + file.getOriginalFilename());
            }
        }
        // ── Handle scanner files ───────────────────────────────
        if (hasScannerFiles) {
            for (String scannerFileName : scannerFileNames) {
                try {
                    Path sourcePath = Paths.get(scannerFolderPath, scannerFileName);
                    String uniqueName = UUID.randomUUID() + "_" + scannerFileName;
                    Path destPath = Paths.get(uploadDir, uniqueName);

                    Files.createDirectories(Paths.get(uploadDir));
                    Files.copy(sourcePath, destPath, StandardCopyOption.REPLACE_EXISTING);

                    String fileType = Files.probeContentType(sourcePath);

                    FileEntity fe = new FileEntity();
                    fe.setFilePath(uniqueName);
                    fe.setFileName(scannerFileName);
                    fe.setFileType(fileType != null ? fileType : "application/octet-stream");
                    fe.setFileSize(Files.size(sourcePath));
                    fe.setMakhzanWaradaSadera(existingDoc);
                    fileRepository.save(fe);
                    existingDoc.getFiles().add(fe);
                    System.out.println("✅ Scanner file on update: " + scannerFileName);

                } catch (java.io.IOException e) {
                    System.err.println("❌ Scanner file failed: " + scannerFileName + " - " + e.getMessage());
                }
            }
        }

        MakhzanWaradaSadera updatedDoc = repository.save(existingDoc);
        auditLogHelper.logUpdate(TABLE_NAME, id.longValue(), existingDoc.getDescription());
        return updatedDoc;
    }

    public void delete(Integer id) {

        MakhzanWaradaSadera entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("MakhzanWaradaSadera not found with id: " + id));

        auditLogHelper.logDelete(TABLE_NAME, id.longValue(), entity.getDescription());
        repository.delete(entity);
    }
}
