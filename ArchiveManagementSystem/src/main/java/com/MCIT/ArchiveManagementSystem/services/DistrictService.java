package com.MCIT.ArchiveManagementSystem.services;

import com.MCIT.ArchiveManagementSystem.models.District;
import com.MCIT.ArchiveManagementSystem.models.Province;
import com.MCIT.ArchiveManagementSystem.repositories.DistrictRepository;
import com.MCIT.ArchiveManagementSystem.repositories.ProvinceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DistrictService {

    private final DistrictRepository districtRepository;
    private final ProvinceRepository provinceRepository;

    public DistrictService(DistrictRepository districtRepository, ProvinceRepository provinceRepository) {
        this.districtRepository = districtRepository;
        this.provinceRepository = provinceRepository;
    }

    public List<District> getByProvince(Integer provinceId) {
        return districtRepository.findByProvinceId(provinceId);
    }

    public District create(Integer provinceId, District district) {
        Province province = provinceRepository.findById(provinceId)
            .orElseThrow(() -> new RuntimeException("Province not found with id: " + provinceId));
        district.setProvince(province);
        return districtRepository.save(district);
    }

    public District update(Integer id, District updated) {
        District existing = districtRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("District not found with id: " + id));
        existing.setName(updated.getName());

        // Allow changing the province too if provided
        if (updated.getProvince() != null && updated.getProvince().getId() != null) {
            Province province = provinceRepository.findById(updated.getProvince().getId())
                .orElseThrow(() -> new RuntimeException("Province not found"));
            existing.setProvince(province);
        }

        return districtRepository.save(existing);
    }

    public void delete(Integer id) {
        if (!districtRepository.existsById(id)) {
            throw new RuntimeException("District not found with id: " + id);
        }
        districtRepository.deleteById(id);
    }
}