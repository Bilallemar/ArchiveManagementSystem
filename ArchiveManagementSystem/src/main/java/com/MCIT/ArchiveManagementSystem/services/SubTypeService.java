package com.MCIT.ArchiveManagementSystem.services;

import com.MCIT.ArchiveManagementSystem.models.SubType;
import com.MCIT.ArchiveManagementSystem.repositories.SubTypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubTypeService {

    private final SubTypeRepository subTypeRepository;

    public SubTypeService(SubTypeRepository subTypeRepository) {
        this.subTypeRepository = subTypeRepository;
    }

    public SubType createSubType(SubType subType) {
        return subTypeRepository.save(subType);
    }

    public SubType updateSubType(Integer id, SubType subType) {
        SubType existing = subTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubType not found"));
        existing.setName(subType.getName());
        existing.setType(subType.getType());
        return subTypeRepository.save(existing);
    }

    public void deleteSubType(Integer id) {
        subTypeRepository.deleteById(id);
    }

    public List<SubType> getAllSubTypes() {
        return subTypeRepository.findAll();
    }

    public SubType getSubTypeById(Integer id) {
        return subTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubType not found"));
    }

    // ✅ ADD THIS: Get SubTypes by Type ID
    public List<SubType> getSubTypesByTypeId(Integer typeId) {
        return subTypeRepository.findByTypeId(typeId);
    }
}