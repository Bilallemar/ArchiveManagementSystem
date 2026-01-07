package com.MCIT.ArchiveManagementSystem.controller.StorageManagementControllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.StorageManagementService.MakzanSubmissionReportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@RestController
@RequestMapping("/api/annual-reports-info")
public class MakzanSubmissionReportController {
    
    @Autowired
    private ManagementSecurityService managementSecurity;
        private static final Long MAKHZAN_MANAGEMENT_ID = 3L; // Makhzan management ID

private final MakzanSubmissionReportService makzanSubmissionReportService;
    public MakzanSubmissionReportController ( MakzanSubmissionReportService makzanSubmissionReportService) {
        this.makzanSubmissionReportService = makzanSubmissionReportService;
    }



    @GetMapping
    public List<MakzanSubmissionReport> gitAllMakzanSubmissionReport() {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        return makzanSubmissionReportService.gitAllMakzanSubmissionReport();

    }
    @GetMapping("/{id}")
    public ResponseEntity<MakzanSubmissionReport> getMakzanSubmissionReportById(@PathVariable Integer id) {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        return makzanSubmissionReportService.getMakzanSubmissionReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // @PostMapping
    // public MakzanSubmissionReport createMakzanSubmissionReport(@RequestBody MakzanSubmissionReport annualReport) {
    //             managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

    //     return makzanSubmissionReportService.createMakzanSubmissionReport(annualReport);
    // }
        @PostMapping
    public MakzanSubmissionReport createMakzanSubmissionReport(
            @RequestPart("annualReport") String annualReportJson,
            @RequestPart(value = "fileURL", required = false) MultipartFile fileURL) throws IOException {
                        managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);


        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        MakzanSubmissionReport makzanSubmissionReport = mapper.readValue(annualReportJson, MakzanSubmissionReport.class);

        return makzanSubmissionReportService.createMakzanSubmissionReport(makzanSubmissionReport, fileURL);
    }
    @PutMapping("/{id}")
    public  ResponseEntity<MakzanSubmissionReport> updateMakzanSubmissionReport(@PathVariable Integer id,@RequestBody MakzanSubmissionReport annualReportDetails) {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        return makzanSubmissionReportService.getMakzanSubmissionReportById(id)
                .map(existingReport -> {
                    MakzanSubmissionReport updatedReport = makzanSubmissionReportService.updateMakzanSubmissionReport(id, annualReportDetails);
                    return ResponseEntity.ok(updatedReport);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMakzanSubmissionReport(@PathVariable Integer id) {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        try {
            makzanSubmissionReportService.deleteMakzanSubmissionReport(id);
            return ResponseEntity.ok().body("AnnualReport with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("AnnualReport with ID " + id + " not found.");
        }
    }

//         @GetMapping("/search")
// public List<MakzanSubmissionReport> searchAnnualReport(
//         @RequestParam(required = false) String keyword,
//         @RequestParam(required = false) String field) {
//     return makzanSubmissionReportService.searchByKeyword(field, keyword);
// }
}



