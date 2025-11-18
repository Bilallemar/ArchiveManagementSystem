package com.MCIT.ArchiveManagementSystem.services.RepositoryManagement;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaHazariRepository;

@Service
public class HifziyaHazariService {
    private final HifziyaHazariRepository hifziyaHazariRepository;
    
    public HifziyaHazariService( HifziyaHazariRepository hifziyaHazariRepository) {
        this.hifziyaHazariRepository = hifziyaHazariRepository;

    }


    public List<HifziyaHazari> getAllHifziyaHazaris() {
        return hifziyaHazariRepository.findAll();
    }
    public Optional<HifziyaHazari> getHifziyaHazariById(Integer id) {
        return hifziyaHazariRepository.findById(id);
    }
    public HifziyaHazari createHifziyaHazari(HifziyaHazari fileOffice) {
        return hifziyaHazariRepository.save(fileOffice);
    }
    public HifziyaHazari updateHifziyaHazari(Integer id, HifziyaHazari fileOfficeDetails) {
        HifziyaHazari existingDoc = hifziyaHazariRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FileOffice not found with id: " + id));

        existingDoc.setType(fileOfficeDetails.getType());
        existingDoc.setYear(fileOfficeDetails.getYear());
        existingDoc.setOrg(fileOfficeDetails.getOrg());
        existingDoc.setFile(fileOfficeDetails.getFile());
        existingDoc.setDescription(fileOfficeDetails.getDescription());
        existingDoc.setIsIndraj(fileOfficeDetails.getIsIndraj());

        return hifziyaHazariRepository.save(existingDoc);

    }
    public void deleteHifziyaHazari(Integer id) {
        HifziyaHazari fileOffice = hifziyaHazariRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FileOffice not found with id: " + id));
        hifziyaHazariRepository.delete(fileOffice);
    }
}
