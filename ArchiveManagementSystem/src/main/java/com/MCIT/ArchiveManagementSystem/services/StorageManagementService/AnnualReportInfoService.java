package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.AnnualReportInfo;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.AnnualReportInfoRepository;

@Service
public class AnnualReportInfoService {
    private final AnnualReportInfoRepository annualReportInfoRepository;
    public AnnualReportInfoService( AnnualReportInfoRepository annualReportInfoRepository) {
        this.annualReportInfoRepository = annualReportInfoRepository;
    }
     public List<AnnualReportInfo> gitAllAnnualReportInfo() {
        return annualReportInfoRepository.findAll();
    }
    public Optional<AnnualReportInfo> getAnnualReportInfoById(Long id) {
        return annualReportInfoRepository.findById(id);
    }

    public AnnualReportInfo createAnnualReportInfo(AnnualReportInfo annualReport) {
        return annualReportInfoRepository.save(annualReport);
    }
    public AnnualReportInfo updateAnnualReportInfo(Long id, AnnualReportInfo annualReportDetails) {
        AnnualReportInfo existingReport = annualReportInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AnnualReportInfo not found with id: " + id));
        existingReport.setBookNumber(annualReportDetails.getBookNumber());
        existingReport.setProvince(annualReportDetails.getProvince());
        existingReport.setDistrict(annualReportDetails.getDistrict());
        existingReport.setYear(annualReportDetails.getYear());
        existingReport.setWaseqaType(annualReportDetails.getWaseqaType());
        existingReport.setSummaryOfWaseqa(annualReportDetails.getSummaryOfWaseqa());
        existingReport.setRemarks(annualReportDetails.getRemarks());
        return annualReportInfoRepository.save(existingReport);
    }
    public void deleteAnnualReportInfo(Long id) {

         AnnualReportInfo annualReport = annualReportInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("annualReportInfo not found with id: " + id));
        annualReportInfoRepository.delete(annualReport);
    }
public List<AnnualReportInfo> searchByKeyword(String field, String keyword) {
    // keyword null یا empty وي، ټول ریکارډونه راوړه
    if (keyword == null || keyword.trim().isEmpty()) {
        return annualReportInfoRepository.findAll();
    }

    // field null یا empty وي، default search په ټولو فیلډونو
    if (field == null || field.trim().isEmpty()) {
        return annualReportInfoRepository
            .findByBookNumberContainingIgnoreCaseOrProvinceContainingIgnoreCaseOrDistrictContainingIgnoreCase(
            
                keyword, keyword, keyword
            );
    }

    // اوس safe ده چې switch وکاروې
    switch (field) {
        case "bookNumber":
            return annualReportInfoRepository.findByBookNumberContainingIgnoreCase(keyword);
        case "province":
            return annualReportInfoRepository.findByProvinceContainingIgnoreCase(keyword);
        case "district":
            return annualReportInfoRepository.findByDistrictContainingIgnoreCase(keyword);

        default:
            return annualReportInfoRepository
                .findByBookNumberContainingIgnoreCaseOrProvinceContainingIgnoreCaseOrDistrictContainingIgnoreCase(
                    keyword, keyword, keyword
                );
    }
}
}
