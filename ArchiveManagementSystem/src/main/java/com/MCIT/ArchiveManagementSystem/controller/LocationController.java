package com.MCIT.ArchiveManagementSystem.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.models.District;
import com.MCIT.ArchiveManagementSystem.models.Province;
import com.MCIT.ArchiveManagementSystem.repositories.DistrictRepository;
import com.MCIT.ArchiveManagementSystem.repositories.ProvinceRepository;

@RestController
@RequestMapping("/api/locations")

public class LocationController {

    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    public LocationController(ProvinceRepository provinceRepository, DistrictRepository districtRepository) {
        this.provinceRepository = provinceRepository;
        this.districtRepository = districtRepository;
    }


    @GetMapping("/provinces")
    public List<Province> getProvinces() {
        return provinceRepository.findAll();
    }

    @GetMapping("/districts/{provinceId}")
    public List<District> getDistricts(@PathVariable Integer provinceId) {
        return districtRepository.findByProvinceId(provinceId);
    }
}

