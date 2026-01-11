package com.MCIT.ArchiveManagementSystem.services.StorageManagementService;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanSubmissionReportRepository;
import com.MCIT.ArchiveManagementSystem.util.AuditLogHelper;

@Service
public class MakzanSubmissionReportService {
    private final MakzanSubmissionReportRepository makzanSubmissionReportRepository;
       private final AuditLogHelper auditLogHelper;

        private static final String TABLE_NAME = "makzan_submission_report";

    public MakzanSubmissionReportService( MakzanSubmissionReportRepository makzanSubmissionReportRepository,AuditLogHelper auditLogHelper) {
        this.makzanSubmissionReportRepository = makzanSubmissionReportRepository;
        this.auditLogHelper = auditLogHelper;
    }
     public List<MakzanSubmissionReport> gitAllMakzanSubmissionReport() {
        return makzanSubmissionReportRepository.findAll();
    }
    public Optional<MakzanSubmissionReport> getMakzanSubmissionReportById(Integer id) {
        return makzanSubmissionReportRepository.findById(id);
    }

    // public MakzanSubmissionReport createMakzanSubmissionReport(MakzanSubmissionReport annualReport) {
    //     auditLogHelper.logCreate(TABLE_NAME, annualReport.getId().longValue(), 
    //         annualReport.getDescription());
    //     return makzanSubmissionReportRepository.save(annualReport);
    // }
        public MakzanSubmissionReport createMakzanSubmissionReport(MakzanSubmissionReport annualReport, MultipartFile fileURL) {
        annualReport = makzanSubmissionReportRepository.save(annualReport);


auditLogHelper.logCreate(TABLE_NAME, annualReport.getId().longValue(), 
          annualReport.getDescription());
        return annualReport;
    }
    public MakzanSubmissionReport updateMakzanSubmissionReport(Integer id, MakzanSubmissionReport annualReportDetails) {
        MakzanSubmissionReport existingReport = makzanSubmissionReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MakzanSubmissionReport not found with id: " + id));
        existingReport.setAddress(annualReportDetails.getAddress());
        existingReport.setYear(annualReportDetails.getYear());
        existingReport.setDocType(annualReportDetails.getDocType());
        existingReport.setSummaryWaseqa(annualReportDetails.getSummaryWaseqa());
        existingReport.setDescription(annualReportDetails.getDescription());

        auditLogHelper.logUpdate(TABLE_NAME, annualReportDetails.getId().longValue(), annualReportDetails.getDescription());

        return makzanSubmissionReportRepository.save(existingReport);

    }
    public void deleteMakzanSubmissionReport(Integer id) {

         MakzanSubmissionReport annualReport = makzanSubmissionReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("annualReportInfo not found with id: " + id));
             auditLogHelper.logDelete(TABLE_NAME, id.longValue(), annualReport.getDescription());

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
