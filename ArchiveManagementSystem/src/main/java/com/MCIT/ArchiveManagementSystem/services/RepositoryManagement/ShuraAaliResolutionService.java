package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ShuraAaliResolution;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.ShuraAaliResolutionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShuraAaliResolutionService {

    private final ShuraAaliResolutionRepository repository;

    public ShuraAaliResolutionService(ShuraAaliResolutionRepository repository) {
        this.repository = repository;
    }

    public List<ShuraAaliResolution> getAll() {
        return repository.findAll();
    }

    public Optional<ShuraAaliResolution> getById(Integer id) {
        return repository.findById(id);
    }

    public ShuraAaliResolution create(ShuraAaliResolution resolution) {
        return repository.save(resolution);
    }

public ShuraAaliResolution update(Integer id, ShuraAaliResolution details) {

    ShuraAaliResolution existing =
        repository.findById(id)
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

    return repository.save(existing);
}

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
