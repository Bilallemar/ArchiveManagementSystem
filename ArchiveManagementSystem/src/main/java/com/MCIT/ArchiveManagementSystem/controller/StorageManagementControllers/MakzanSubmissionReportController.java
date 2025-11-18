package com.MCIT.ArchiveManagementSystem.controller.StorageManagementControllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;
import com.MCIT.ArchiveManagementSystem.services.StorageManagementService.MakzanSubmissionReportService;

@RestController
@RequestMapping("/api/annual-reports-info")
public class MakzanSubmissionReportController {
    

private final MakzanSubmissionReportService makzanSubmissionReportService;
    public MakzanSubmissionReportController ( MakzanSubmissionReportService makzanSubmissionReportService) {
        this.makzanSubmissionReportService = makzanSubmissionReportService;
    }



    @GetMapping
    public List<MakzanSubmissionReport> gitAllMakzanSubmissionReport() {
        return makzanSubmissionReportService.gitAllMakzanSubmissionReport();

    }
    @GetMapping("/{id}")
    public ResponseEntity<MakzanSubmissionReport> getMakzanSubmissionReportById(@PathVariable Integer id) {
        return makzanSubmissionReportService.getMakzanSubmissionReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public MakzanSubmissionReport createMakzanSubmissionReport(@RequestBody MakzanSubmissionReport annualReport) {
        return makzanSubmissionReportService.createMakzanSubmissionReport(annualReport);
    }
    @PutMapping("/{id}")
    public  ResponseEntity<MakzanSubmissionReport> updateMakzanSubmissionReport(@PathVariable Integer id,@RequestBody MakzanSubmissionReport annualReportDetails) {
        return makzanSubmissionReportService.getMakzanSubmissionReportById(id)
                .map(existingReport -> {
                    MakzanSubmissionReport updatedReport = makzanSubmissionReportService.updateMakzanSubmissionReport(id, annualReportDetails);
                    return ResponseEntity.ok(updatedReport);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMakzanSubmissionReport(@PathVariable Integer id) {
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



