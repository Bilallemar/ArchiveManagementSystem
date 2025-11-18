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

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanAnnualReport;
import com.MCIT.ArchiveManagementSystem.services.StorageManagementService.MakzanAnnualReportService;

@RestController
@RequestMapping("/api/makzan-annual-reports")
public class MakzanAnnualReportController {
    

private final MakzanAnnualReportService makzanAnnualReportService;
    public MakzanAnnualReportController( MakzanAnnualReportService makzanAnnualReportService) {
        this.makzanAnnualReportService = makzanAnnualReportService;
    }



    @GetMapping
    public List<MakzanAnnualReport> gitAllAnnualReports() {
        return makzanAnnualReportService.gitAllAnnualReports();

    }
    @GetMapping("/{id}")
    public ResponseEntity<MakzanAnnualReport> getAnnualReportById(@PathVariable Integer id) {
        return makzanAnnualReportService.getAnnualReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public MakzanAnnualReport createAnnualReport(@RequestBody MakzanAnnualReport annualReport) {
        return makzanAnnualReportService.createAnnualReport(annualReport);
    }
    
    @PutMapping("/{id}")
    public  ResponseEntity<MakzanAnnualReport> updateAnnualReport(@PathVariable Integer id,@RequestBody MakzanAnnualReport annualReportDetails) {
        return makzanAnnualReportService.getAnnualReportById(id)
                .map(existingReport -> {
                    MakzanAnnualReport updatedReport = makzanAnnualReportService.updateAnnualReport(id, annualReportDetails);
                    return ResponseEntity.ok(updatedReport);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnualReport(@PathVariable Integer id) {
         try {
            makzanAnnualReportService.deleteAnnualReport(id);
            return ResponseEntity.ok().body("AnnualReport with ID " + id + " has been successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("AnnualReport with ID " + id + " not found.");
        }
    }

//     @GetMapping("/search")
// public List<MakzanAnnualReport> searchAnnualReport(
//         @RequestParam(required = false) String keyword,
//         @RequestParam(required = false) String field) {
//     return makzanAnnualReportService.searchByKeyword(field, keyword);
// }
}



