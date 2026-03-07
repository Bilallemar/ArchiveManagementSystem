package com.MCIT.ArchiveManagementSystem.services.ArchiveManagement;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.dtos.ArchiveSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive;
import com.MCIT.ArchiveManagementSystem.models.enums.ArchiveDirection;
import com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement.ArchiveRepository;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

@Service
public class ArchiveService {

    private static final String TABLE_NAME = "archive";

    private final ArchiveRepository archiveRepository;
    private final AuditLogHelper auditLogHelper;

    public ArchiveService(ArchiveRepository archiveRepository,
            AuditLogHelper auditLogHelper) {
        this.archiveRepository = archiveRepository;
        this.auditLogHelper = auditLogHelper;
    }

    // ── LIST (paginated, summary only) ─────────────────────────────────────
    public Page<ArchiveSummaryDTO> getArchives(
            Management management,
            String direction,
            String field,
            String term,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        String cleanTerm = (term == null) ? "" : term.trim();

        // Convert String → enum
        ArchiveDirection directionEnum = null;
        if (direction != null && !direction.isBlank()) {
            directionEnum = ArchiveDirection.valueOf(direction.toUpperCase());
        }

        Page<Archive> raw = archiveRepository.searchArchives(
                management, directionEnum, field, cleanTerm, pageable); // ← directionEnum not cleanDirection

        return raw.map(a -> new ArchiveSummaryDTO(
                a.getId(),
                a.getDocNo(),
                a.getSendDate() != null ? a.getSendDate().toString() : null,
                a.getReceiveDate() != null ? a.getReceiveDate().toString() : null,
                a.getDepartmentDate() != null ? a.getDepartmentDate().toString() : null,
                a.getSenderOrg() != null ? a.getSenderOrg().getName() : null,
                a.getReceiverOrg() != null ? a.getReceiverOrg().getName() : null,
                a.getDocType() != null ? a.getDocType().getName() : null,
                a.getDirection() != null ? a.getDirection().name() : null,
                a.getDescription()));
    }

    // ── DETAIL (full entity, only when user clicks View) ───────────────────
    public Optional<Archive> getArchiveById(Integer id) {
        return archiveRepository.findById(id);
    }

    // ── CREATE / UPDATE / DELETE (unchanged) ───────────────────────────────
    public Archive createExportDoc(Archive archive) {
        if (archive.getSenderOrg() == null || archive.getSenderOrg().getId() == null)
            throw new RuntimeException("Sender organization is required");
        if (archive.getReceiverOrg() == null || archive.getReceiverOrg().getId() == null)
            throw new RuntimeException("Receiver organization is required");

        Archive saved = archiveRepository.save(archive);
        auditLogHelper.logCreate(TABLE_NAME, saved.getId().longValue(), saved.getDescription());
        return saved;
    }

    public Archive updateArchive(Integer id, Archive details) {
        Archive existing = archiveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Archive not found: " + id));

        existing.setDocNo(details.getDocNo());
        existing.setReceiveDate(details.getReceiveDate());
        existing.setSendDate(details.getSendDate());
        existing.setDepartmentDate(details.getDepartmentDate());
        existing.setSenderOrg(details.getSenderOrg());
        existing.setReceiverOrg(details.getReceiverOrg());
        existing.setDocType(details.getDocType());
        existing.setDescription(details.getDescription());
        existing.setDirection(details.getDirection());

        auditLogHelper.logUpdate(TABLE_NAME, existing.getId().longValue(), existing.getDescription());
        return archiveRepository.save(existing);
    }

    public void deleteArchive(Integer id) {
        Archive archive = archiveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Archive not found: " + id));
        auditLogHelper.logDelete(TABLE_NAME, id.longValue(), archive.getDescription());
        archiveRepository.delete(archive);
    }
}