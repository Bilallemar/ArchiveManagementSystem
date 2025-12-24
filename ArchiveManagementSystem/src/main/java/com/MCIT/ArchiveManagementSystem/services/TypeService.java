package com.MCIT.ArchiveManagementSystem.services;

import com.MCIT.ArchiveManagementSystem.models.Type;
import com.MCIT.ArchiveManagementSystem.repositories.TypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TypeService {

    private final TypeRepository typeRepository;

    public TypeService(TypeRepository typeRepository) {
        this.typeRepository = typeRepository;
    }

    public List<Type> getAllTypes() {
        return typeRepository.findAll();
    }

    public Type getTypeById(Integer id) {
        return typeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Type not found with id: " + id));
    }

    public Type createType(Type type) {
        return typeRepository.save(type);
    }

    public Type updateType(Integer id, Type typeDetails) {
        Type existing = typeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Type not found with id: " + id));

        existing.setName(typeDetails.getName());
        return typeRepository.save(existing);
    }

    public void deleteType(Integer id) {
        Type existing = typeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Type not found with id: " + id));
        typeRepository.delete(existing);
    }
}
