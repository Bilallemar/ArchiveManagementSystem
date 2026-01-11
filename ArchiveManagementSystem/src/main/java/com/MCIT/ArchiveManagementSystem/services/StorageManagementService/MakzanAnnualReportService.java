package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanAnnualReport;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanAnnualReportRepository;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

@Service
public class MakzanAnnualReportService {
    private final MakzanAnnualReportRepository makzanAnnualReportRepository;
       private final AuditLogHelper auditLogHelper;
        private static final String TABLE_NAME = "makzan_annual_report";


    public MakzanAnnualReportService( MakzanAnnualReportRepository makzanAnnualReportRepository,AuditLogHelper auditLogHelper) {
        this.makzanAnnualReportRepository = makzanAnnualReportRepository;
        this.auditLogHelper = auditLogHelper;
    }
     public List<MakzanAnnualReport> gitAllAnnualReports() {
        return makzanAnnualReportRepository.findAll();
    }
    public Optional<MakzanAnnualReport> getAnnualReportById(Integer id) {
        return makzanAnnualReportRepository.findById(id);
    }

    public MakzanAnnualReport createAnnualReport(MakzanAnnualReport annualReport) {
        auditLogHelper.logCreate(TABLE_NAME, annualReport.getId().longValue(), 
            annualReport.getDescription());
        return makzanAnnualReportRepository.save(annualReport);
    }
    public MakzanAnnualReport updateAnnualReport(Integer id, MakzanAnnualReport annualReportDetails) {

        MakzanAnnualReport existingReport = makzanAnnualReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AnnualReport not found with id: " + id));

    existingReport.setAddress(annualReportDetails.getAddress());
    existingReport.setYear(annualReportDetails.getYear());
    existingReport.setDocType(annualReportDetails.getDocType());
    existingReport.setSummaryWaseqa(annualReportDetails.getSummaryWaseqa());
    existingReport.setDescription(annualReportDetails.getDescription());
auditLogHelper.logUpdate(TABLE_NAME, annualReportDetails.getId().longValue(), annualReportDetails.getDescription());

        return makzanAnnualReportRepository.save(existingReport);
    }
    public void deleteAnnualReport(Integer id) {
         MakzanAnnualReport annualReport = makzanAnnualReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("annualReport not found with id: " + id));
                     auditLogHelper.logDelete(TABLE_NAME, id.longValue(), annualReport.getDescription());

        makzanAnnualReportRepository.delete(annualReport);
    }
//     public List<MakzanAnnualReport> searchByKeyword(String field, String keyword) {
//     // keyword null یا empty وي، ټول ریکارډونه راوړه
//     if (keyword == null || keyword.trim().isEmpty()) {
//         return makzanAnnualReportRepository.findAll();
//     }

//     // field null یا empty وي، default search په ټولو فیلډونو
//     if (field == null || field.trim().isEmpty()) {
//         return makzanAnnualReportRepository
//             .findByBookNumberContainingIgnoreCaseOrProvinceContainingIgnoreCaseOrDistrictContainingIgnoreCase(
            
//                 keyword, keyword, keyword
//             );
//     }

//     // اوس safe ده چې switch وکاروې
//     switch (field) {
//         case "bookNumber":
//             return makzanAnnualReportRepository.findByBookNumberContainingIgnoreCase(keyword);
//         case "province":
//             return makzanAnnualReportRepository.findByProvinceContainingIgnoreCase(keyword);
//         case "district":
//             return makzanAnnualReportRepository.findByDistrictContainingIgnoreCase(keyword);

//         default:
//             return makzanAnnualReportRepository
//                 .findByBookNumberContainingIgnoreCaseOrProvinceContainingIgnoreCaseOrDistrictContainingIgnoreCase(
//                     keyword, keyword, keyword
//                 );
//     }
// }
}
    

