package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.dtos.ShuraAaliResolutionDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ShuraAaliResolution;
import com.MCIT.ArchiveManagementSystem.models.enums.ShuraAliDirection;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.ShuraAaliResolutionRepository;

@Service
public class ShuraAaliResolutionService {

    private final ShuraAaliResolutionRepository repository;

    public ShuraAaliResolutionService(ShuraAaliResolutionRepository repository) {
        this.repository = repository;
    }

    public Page<ShuraAaliResolutionDTO> getAll(
            Management management,
            String direction,
            String field,
            String term,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        String cleanTerm = (term == null) ? "" : term.trim();

        // Convert String → enum
        ShuraAliDirection directionEnum = null;
        if (direction != null && !direction.isBlank()) {
            directionEnum = ShuraAliDirection.valueOf(direction.toUpperCase());
        }

        Page<ShuraAaliResolution> raw = repository.searchShuraAaliResolution(
                management, directionEnum, field, cleanTerm, pageable); // ← directionEnum not cleanDirection

        return raw.map(s -> new ShuraAaliResolutionDTO(
                s.getId(),
                s.getTitle(),
                s.getSubject(),
                s.getLetterNumber(),
                s.getApprovalYear(),
                s.getDirection() != null ? s.getDirection().name() : null));
    }

    public Optional<ShuraAaliResolution> getById(Integer id) {
        return repository.findById(id);
    }

    public ShuraAaliResolution create(ShuraAaliResolution resolution) {
        return repository.save(resolution);
    }

    public ShuraAaliResolution update(Integer id, ShuraAaliResolution details) {

        ShuraAaliResolution existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        existing.setSendDate(details.getSendDate());
        existing.setSubject(details.getSubject());
        existing.setSenderReference(details.getSenderReference());
        existing.setTitle(details.getTitle());
        existing.setResolutionType(details.getResolutionType());
        existing.setLetterNumber(details.getLetterNumber());
        existing.setResolutionNo(details.getResolutionNo());
        existing.setApprovalYear(details.getApprovalYear());
        existing.setRemarks(details.getRemarks());
        existing.setCabinetFile(details.getCabinetFile());

        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
