package com.MCIT.ArchiveManagementSystem.services;

import com.MCIT.ArchiveManagementSystem.models.Province;
import com.MCIT.ArchiveManagementSystem.repositories.ProvinceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProvinceService {

    private final ProvinceRepository provinceRepository;

    public ProvinceService(ProvinceRepository provinceRepository) {
        this.provinceRepository = provinceRepository;
    }

    public List<Province> getAll() {
        return provinceRepository.findAll();
    }

    public Province create(Province province) {
        return provinceRepository.save(province);
    }

    public Province update(Integer id, Province updated) {
        Province existing = provinceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Province not found with id: " + id));
        existing.setName(updated.getName());
        return provinceRepository.save(existing);
    }

    public void delete(Integer id) {
        if (!provinceRepository.existsById(id)) {
            throw new RuntimeException("Province not found with id: " + id);
        }
        provinceRepository.deleteById(id);
    }
}