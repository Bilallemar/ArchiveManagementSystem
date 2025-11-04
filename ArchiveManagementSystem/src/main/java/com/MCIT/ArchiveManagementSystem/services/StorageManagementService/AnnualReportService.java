package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.AnnualReport;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.AnnualReportRepository;

@Service
public class AnnualReportService {
    private final AnnualReportRepository annualReportRepository;
    public AnnualReportService( AnnualReportRepository annualReportRepository) {
        this.annualReportRepository = annualReportRepository;
    }
     public List<AnnualReport> gitAllAnnualReports() {
        return annualReportRepository.findAll();
    }
    public Optional<AnnualReport> getAnnualReportById(Long id) {
        return annualReportRepository.findById(id);
    }

    public AnnualReport createAnnualReport(AnnualReport annualReport) {
        return annualReportRepository.save(annualReport);
    }
    public AnnualReport updateAnnualReport(Long id, AnnualReport annualReportDetails) {

        AnnualReport existingReport = annualReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AnnualReport not found with id: " + id));

    existingReport.setBookNumber(annualReportDetails.getBookNumber());
    existingReport.setProvince(annualReportDetails.getProvince());
    existingReport.setDistrict(annualReportDetails.getDistrict());
    existingReport.setYear(annualReportDetails.getYear());
    existingReport.setWaseqaType(annualReportDetails.getWaseqaType());
    existingReport.setSummaryOfWaseqa(annualReportDetails.getSummaryOfWaseqa());
    existingReport.setRemarks(annualReportDetails.getRemarks());

        return annualReportRepository.save(existingReport);
    }
    public void deleteAnnualReport(Long id) {
         AnnualReport annualReport = annualReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("annualReport not found with id: " + id));
        annualReportRepository.delete(annualReport);
    }
    public List<AnnualReport> searchByKeyword(String field, String keyword) {
    // keyword null یا empty وي، ټول ریکارډونه راوړه
    if (keyword == null || keyword.trim().isEmpty()) {
        return annualReportRepository.findAll();
    }

    // field null یا empty وي، default search په ټولو فیلډونو
    if (field == null || field.trim().isEmpty()) {
        return annualReportRepository
            .findByBookNumberContainingIgnoreCaseOrProvinceContainingIgnoreCaseOrDistrictContainingIgnoreCase(
            
                keyword, keyword, keyword
            );
    }

    // اوس safe ده چې switch وکاروې
    switch (field) {
        case "bookNumber":
            return annualReportRepository.findByBookNumberContainingIgnoreCase(keyword);
        case "province":
            return annualReportRepository.findByProvinceContainingIgnoreCase(keyword);
        case "district":
            return annualReportRepository.findByDistrictContainingIgnoreCase(keyword);

        default:
            return annualReportRepository
                .findByBookNumberContainingIgnoreCaseOrProvinceContainingIgnoreCaseOrDistrictContainingIgnoreCase(
                    keyword, keyword, keyword
                );
    }
}
}
    

