package com.MCIT.ArchiveManagementSystem.services;

import com.MCIT.ArchiveManagementSystem.models.SubType;
import com.MCIT.ArchiveManagementSystem.models.Type;
import com.MCIT.ArchiveManagementSystem.repositories.SubTypeRepository;
import com.MCIT.ArchiveManagementSystem.repositories.TypeRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubTypeService {

    private final SubTypeRepository subTypeRepository;
    private final TypeRepository typeRepository;

    public SubTypeService(SubTypeRepository subTypeRepository, TypeRepository typeRepository) {
        this.subTypeRepository = subTypeRepository;
        this.typeRepository = typeRepository;
    }

public List<SubType> getAllSubTypes() {
    List<SubType> subTypes = subTypeRepository.findAll();
    // Hibernate معمولا EAGER fetch کوي، که lazy وي، نو initialize کړئ
    subTypes.forEach(s -> {
        if (s.getType() != null) {
            s.getType().getName(); // force load
        }
    });
    return subTypes;
}


    public SubType getSubTypeById(Integer id) {
        return subTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubType not found with id: " + id));
    }

public SubType createSubType(SubType subType) {
    if (subType.getType() != null && subType.getType().getId() != null) {
        Type type = typeRepository.findById(subType.getType().getId())
                .orElseThrow(() -> new RuntimeException("Type not found with id: " + subType.getType().getId()));
        subType.setType(type);
    }
    return subTypeRepository.save(subType);
}

public SubType updateSubType(Integer id, SubType subTypeDetails) {
    SubType existing = subTypeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("SubType not found with id: " + id));

    existing.setName(subTypeDetails.getName());

    if (subTypeDetails.getType() != null && subTypeDetails.getType().getId() != null) {
        Type type = typeRepository.findById(subTypeDetails.getType().getId())
                .orElseThrow(() -> new RuntimeException("Type not found with id: " + subTypeDetails.getType().getId()));
        existing.setType(type);
    }

    return subTypeRepository.save(existing);
}


    public void deleteSubType(Integer id) {
        SubType existing = subTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubType not found with id: " + id));
        subTypeRepository.delete(existing);
    }
}
