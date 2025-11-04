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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.AnnualReport;
import com.MCIT.ArchiveManagementSystem.services.StorageManagementService.AnnualReportService;

@RestController
@RequestMapping("/api/annual-reports")
public class AnnualReportController {
    

private final AnnualReportService annualReportService;
    public AnnualReportController( AnnualReportService annualReportService) {
        this.annualReportService = annualReportService;
    }



    @GetMapping
    public List<AnnualReport> gitAllAnnualReports() {
        return annualReportService.gitAllAnnualReports();

    }
    @GetMapping("/{id}")
    public ResponseEntity<AnnualReport> getAnnualReportById(@PathVariable Long id) {
        return annualReportService.getAnnualReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public AnnualReport createAnnualReport(@RequestBody AnnualReport annualReport) {
        return annualReportService.createAnnualReport(annualReport);
    }
    
    @PutMapping("/{id}")
    public  ResponseEntity<AnnualReport> updateAnnualReport(@PathVariable Long id,@RequestBody AnnualReport annualReportDetails) {
        return annualReportService.getAnnualReportById(id)
                .map(existingReport -> {
                    AnnualReport updatedReport = annualReportService.updateAnnualReport(id, annualReportDetails);
                    return ResponseEntity.ok(updatedReport);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnualReport(@PathVariable Long id) {
         try {
            annualReportService.deleteAnnualReport(id);
            return ResponseEntity.ok().body("AnnualReport with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("AnnualReport with ID " + id + " not found.");
        }
    }

    @GetMapping("/search")
public List<AnnualReport> searchAnnualReport(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String field) {
    return annualReportService.searchByKeyword(field, keyword);
}
}



