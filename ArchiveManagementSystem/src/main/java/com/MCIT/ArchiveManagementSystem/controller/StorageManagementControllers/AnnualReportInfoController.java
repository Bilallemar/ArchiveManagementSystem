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

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.AnnualReportInfo;
import com.MCIT.ArchiveManagementSystem.services.StorageManagementService.AnnualReportInfoService;

@RestController
@RequestMapping("/annual-reports-info")
public class AnnualReportInfoController {
    

private final AnnualReportInfoService annualReportInfoService;
    public AnnualReportInfoController ( AnnualReportInfoService annualReportInfoService) {
        this.annualReportInfoService = annualReportInfoService;
    }



    @GetMapping
    public List<AnnualReportInfo> gitAllAnnualReportInfo() {
        return annualReportInfoService.gitAllAnnualReportInfo();

    }
    @GetMapping("/{id}")
    public ResponseEntity<AnnualReportInfo> getAnnualReportInfoById(@PathVariable Long id) {
        return annualReportInfoService.getAnnualReportInfoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public AnnualReportInfo createAnnualReportInfo(@RequestBody AnnualReportInfo annualReport) {
        return annualReportInfoService.createAnnualReportInfo(annualReport);
    }
    @PutMapping("/{id}")
    public  ResponseEntity<AnnualReportInfo> updateAnnualReportInfo(@PathVariable Long id,@RequestBody AnnualReportInfo annualReportDetails) {
        return annualReportInfoService.getAnnualReportInfoById(id)
                .map(existingReport -> {
                    AnnualReportInfo updatedReport = annualReportInfoService.updateAnnualReportInfo(id, annualReportDetails);
                    return ResponseEntity.ok(updatedReport);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnualReportInfo(@PathVariable Long id) {
        try {
            annualReportInfoService.deleteAnnualReportInfo(id);
            return ResponseEntity.ok().body("AnnualReport with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("AnnualReport with ID " + id + " not found.");
        }
    }
}



