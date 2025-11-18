package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanSubmissionReportRepository;

@Service
public class MakzanSubmissionReportService {
    private final MakzanSubmissionReportRepository makzanSubmissionReportRepository;
    public MakzanSubmissionReportService( MakzanSubmissionReportRepository makzanSubmissionReportRepository) {
        this.makzanSubmissionReportRepository = makzanSubmissionReportRepository;
    }
     public List<MakzanSubmissionReport> gitAllMakzanSubmissionReport() {
        return makzanSubmissionReportRepository.findAll();
    }
    public Optional<MakzanSubmissionReport> getMakzanSubmissionReportById(Integer id) {
        return makzanSubmissionReportRepository.findById(id);
    }

    public MakzanSubmissionReport createMakzanSubmissionReport(MakzanSubmissionReport annualReport) {
        return makzanSubmissionReportRepository.save(annualReport);
    }
    public MakzanSubmissionReport updateMakzanSubmissionReport(Integer id, MakzanSubmissionReport annualReportDetails) {
        MakzanSubmissionReport existingReport = makzanSubmissionReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MakzanSubmissionReport not found with id: " + id));
        existingReport.setAddress(annualReportDetails.getAddress());
        existingReport.setYear(annualReportDetails.getYear());
        existingReport.setDocType(annualReportDetails.getDocType());
        existingReport.setSummaryWaseqa(annualReportDetails.getSummaryWaseqa());
        existingReport.setDescription(annualReportDetails.getDescription());
        return makzanSubmissionReportRepository.save(existingReport);

    }
    public void deleteMakzanSubmissionReport(Integer id) {

         MakzanSubmissionReport annualReport = makzanSubmissionReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("annualReportInfo not found with id: " + id));
        makzanSubmissionReportRepository.delete(annualReport);
    }
// public List<AnnualReportInfo> searchByKeyword(String field, String keyword) {
//     // keyword null یا empty وي، ټول ریکارډونه راوړه
//     if (keyword == null || keyword.trim().isEmpty()) {
//         return makzanSubmissionReportRepository.findAll();
//     }

//     // field null یا empty وي، default search په ټولو فیلډونو
//     if (field == null || field.trim().isEmpty()) {
//         return makzanSubmissionReportRepository
//             .findByBookNumberContainingIgnoreCaseOrProvinceContainingIgnoreCaseOrDistrictContainingIgnoreCase(
            
//                 keyword, keyword, keyword
//             );
//     }

//     // اوس safe ده چې switch وکاروې
//     switch (field) {
//         case "bookNumber":
//             return makzanSubmissionReportRepository.findByBookNumberContainingIgnoreCase(keyword);
//         case "province":
//             return makzanSubmissionReportRepository.findByProvinceContainingIgnoreCase(keyword);
//         case "district":
//             return makzanSubmissionReportRepository.findByDistrictContainingIgnoreCase(keyword);

//         default:
//             return makzanSubmissionReportRepository
//                 .findByBookNumberContainingIgnoreCaseOrProvinceContainingIgnoreCaseOrDistrictContainingIgnoreCase(
//                     keyword, keyword, keyword
//                 );
//     }
// }
}
