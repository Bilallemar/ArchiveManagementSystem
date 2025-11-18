package com.MCIT.ArchiveManagementSystem.services.impl;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.repositories.ManagementRepository;
import com.MCIT.ArchiveManagementSystem.services.ManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagementServiceImpl implements ManagementService {

    @Autowired
    private ManagementRepository managementRepository;

    @Override
    public Management createManagement(Management management) {
        if (managementRepository.existsByManagementName(management.getManagementName())) {
            throw new RuntimeException("Management name already exists!");
        }
        return managementRepository.save(management);
    }

    @Override
    public List<Management> getAllManagements() {
        return managementRepository.findAll();
    }

    @Override
    public Management getManagementById(Long id) {
        return managementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Management not found with id: " + id));
    }

    @Override
    public void deleteManagement(Long id) {
        if (!managementRepository.existsById(id)) {
            throw new RuntimeException("Management not found with id: " + id);
        }
        managementRepository.deleteById(id);
    }
}
