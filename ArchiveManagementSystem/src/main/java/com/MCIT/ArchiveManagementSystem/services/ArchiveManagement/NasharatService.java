package com.MCIT.ArchiveManagementSystem.services.ArchiveManagement;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.dtos.NasharatSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Nasharat;
import com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement.NasharatRepository;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

@Service
public class NasharatService {

    private static final String TABLE_NAME = "nasharat";

    private final NasharatRepository nasharatRepository;
    private final AuditLogHelper auditLogHelper;

    public NasharatService(NasharatRepository nasharatRepository,
            AuditLogHelper auditLogHelper) {
        this.nasharatRepository = nasharatRepository;
        this.auditLogHelper = auditLogHelper;
    }

    // ── LIST (paginated, summary only) ─────────────────────────────────────
    public Page<NasharatSummaryDTO> getNasharats(
            Management management,
           
            String field,
            String term,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        String cleanTerm = (term == null) ? "" : term.trim();



        Page<Nasharat> raw = nasharatRepository.searchNasharat(
                management, field, cleanTerm, pageable); // ← directionEnum not cleanDirection

        return raw.map(a -> new NasharatSummaryDTO(
                a.getId(),
                a.getDocNo(),
                a.getSendDate() != null ? a.getSendDate().toString() : null,
                a.getReceiveDate() != null ? a.getReceiveDate().toString() : null,
                a.getDepartmentDate() != null ? a.getDepartmentDate().toString() : null,
                a.getSenderOrg() != null ? a.getSenderOrg().getName() : null,
                a.getReceiverOrg() != null ? a.getReceiverOrg().getName() : null,
                a.getDocType() != null ? a.getDocType().getName() : null,
                a.getDescription()));
    }

    // ── DETAIL (full entity, only when user clicks View) ───────────────────
    public Optional<Nasharat> getNasharatById(Integer id) {
        return nasharatRepository.findById(id);
    }

    // ── CREATE / UPDATE / DELETE (unchanged) ───────────────────────────────
    public Nasharat createExportDoc(Nasharat nasharat) {
        if (nasharat.getSenderOrg() == null || nasharat.getSenderOrg().getId() == null)
            throw new RuntimeException("Sender organization is required");
        if (nasharat.getReceiverOrg() == null || nasharat.getReceiverOrg().getId() == null)
            throw new RuntimeException("Receiver organization is required");

        Nasharat saved = nasharatRepository.save(nasharat);
        auditLogHelper.logCreate(TABLE_NAME, saved.getId().longValue(), saved.getDescription());
        return saved;
    }

    public Nasharat updateNasharat(Integer id, Nasharat details) {
        Nasharat existing = nasharatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nasharat not found: " + id));

        existing.setDocNo(details.getDocNo());
        existing.setReceiveDate(details.getReceiveDate());
        existing.setSendDate(details.getSendDate());
        existing.setDepartmentDate(details.getDepartmentDate());
        existing.setSenderOrg(details.getSenderOrg());
        existing.setReceiverOrg(details.getReceiverOrg());
        existing.setDocType(details.getDocType());
        existing.setDescription(details.getDescription());

        auditLogHelper.logUpdate(TABLE_NAME, existing.getId().longValue(), existing.getDescription());
        return nasharatRepository.save(existing);
    }

    public void deleteNasharat(Integer id) {
        Nasharat nasharat = nasharatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nasharat not found: " + id));
        auditLogHelper.logDelete(TABLE_NAME, id.longValue(), nasharat.getDescription());
        nasharatRepository.delete(nasharat);
    }
}