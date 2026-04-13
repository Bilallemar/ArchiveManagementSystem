package com.MCIT.ArchiveManagementSystem.controller.StorageManagementControllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.MCIT.ArchiveManagementSystem.dtos.MakzanAnnualReportSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanAnnualReport;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.StorageManagementService.MakzanAnnualReportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@RestController
@RequestMapping("/api/makzan-annual-reports")
public class MakzanAnnualReportController {

        private final MakzanAnnualReportService makzanAnnualReportService;
        @Autowired
        private ManagementSecurityService managementSecurity;
        private static final Long MAKHZAN_MANAGEMENT_ID = 3L; // Makhzan management ID

        public MakzanAnnualReportController(MakzanAnnualReportService makzanAnnualReportService) {
                this.makzanAnnualReportService = makzanAnnualReportService;
        }

        // @GetMapping
        // public List<MakzanAnnualReport> gitAllAnnualReports() {
        // managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        // return makzanAnnualReportService.gitAllAnnualReports();

        // }
        @GetMapping
        public ResponseEntity<Page<MakzanAnnualReportSummaryDTO>> gitAllAnnualReports(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "year") String field,
                        @RequestParam(defaultValue = "") String term) {

                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

                // Build Management object from the constant ID
                Management management = new Management();
                management.setManagementId(MAKHZAN_MANAGEMENT_ID);

                Page<MakzanAnnualReportSummaryDTO> result = makzanAnnualReportService.gitAllAnnualReports(
                                management, field, term, page, size);

                return ResponseEntity.ok(result);
        }

        @GetMapping("/{id}")
        public ResponseEntity<MakzanAnnualReport> getAnnualReportById(@PathVariable Integer id) {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

                return makzanAnnualReportService.getAnnualReportById(id)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public MakzanAnnualReport createAnnualReport(

                        @RequestPart("annualReport") String annualReportJson,

                        @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL,

                        @RequestPart(value = "scannerFiles", required = false) String scannerFilesJson

        ) throws IOException {

                managementSecurity.validateManagementAccess(
                                MAKHZAN_MANAGEMENT_ID);

                ObjectMapper mapper = new ObjectMapper();

                mapper.registerModule(
                                new JavaTimeModule());

                MakzanAnnualReport report = mapper.readValue(
                                annualReportJson,
                                MakzanAnnualReport.class);
                Management management = new Management();
                management.setManagementId(MAKHZAN_MANAGEMENT_ID);
                report.setManagement(management);

        List<String> scannerFiles = new ArrayList<>();
        if (scannerFilesJson != null && !scannerFilesJson.isEmpty()) {
            scannerFiles = mapper.readValue(scannerFilesJson,
                    mapper.getTypeFactory().constructCollectionType(List.class, String.class));
        }

                return makzanAnnualReportService
                                .createAnnualReport(report, fileURL, scannerFiles);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> updateAnnualReport(

                        @PathVariable Integer id,

                        @RequestPart("annualReport") String annualReportJson,

                        @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL,
                        @RequestPart(value = "scannerFiles", required = false) String scannerFilesJson

        ) {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

                try {
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.registerModule(new JavaTimeModule());

                        MakzanAnnualReport report = mapper.readValue(
                                        annualReportJson,
                                        MakzanAnnualReport.class);

        List<String> scannerFiles = new ArrayList<>();
        if (scannerFilesJson != null && !scannerFilesJson.isEmpty()) {
            scannerFiles = mapper.readValue(scannerFilesJson,
                    mapper.getTypeFactory().constructCollectionType(List.class, String.class));
        }

                        makzanAnnualReportService.updateAnnualReport(id, report, fileURL, scannerFiles);

                        // ✅ Return success message only — no entity serialization
                        return ResponseEntity.ok("Updated successfully");

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body("Update failed: " + e.getMessage());
                }
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteAnnualReport(@PathVariable Integer id) {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

                try {
                        makzanAnnualReportService.deleteAnnualReport(id);
                        return ResponseEntity.ok()
                                        .body("AnnualReport with ID " + id + " has been successfully deleted.");
                } catch (RuntimeException e) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body("AnnualReport with ID " + id + " not found.");
                }
        }

        // @GetMapping("/search")
        // public List<MakzanAnnualReport> searchAnnualReport(
        // @RequestParam(required = false) String keyword,
        // @RequestParam(required = false) String field) {
        // return makzanAnnualReportService.searchByKeyword(field, keyword);
        // }
}
