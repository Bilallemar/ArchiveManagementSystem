package com.MCIT.ArchiveManagementSystem.controller.StorageManagementControllers;

import java.io.IOException;

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

import com.MCIT.ArchiveManagementSystem.dtos.MakzanSubmissionReportSummaryDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.StorageManagementService.MakzanSubmissionReportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@RestController
@RequestMapping("/api/makzan-submission-reports")
public class MakzanSubmissionReportController {

        @Autowired
        private ManagementSecurityService managementSecurity;
        private static final Long MAKHZAN_MANAGEMENT_ID = 3L; // Makhzan management ID

        private final MakzanSubmissionReportService makzanSubmissionReportService;

        public MakzanSubmissionReportController(MakzanSubmissionReportService makzanSubmissionReportService) {
                this.makzanSubmissionReportService = makzanSubmissionReportService;
        }

        // @GetMapping
        // public List<MakzanSubmissionReport> gitAllMakzanSubmissionReport() {
        // managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

        // return makzanSubmissionReportService.gitAllMakzanSubmissionReport();

        // }
        @GetMapping
        public ResponseEntity<Page<MakzanSubmissionReportSummaryDTO>> gitAllAnnualReports(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "year") String field,
                        @RequestParam(defaultValue = "") String term) {

                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

                // Build Management object from the constant ID
                Management management = new Management();
                management.setManagementId(MAKHZAN_MANAGEMENT_ID);

                Page<MakzanSubmissionReportSummaryDTO> result = makzanSubmissionReportService
                                .gitAllMakzanSubmissionReport(
                                                management, field, term, page, size);

                return ResponseEntity.ok(result);
        }

        @GetMapping("/{id}")
        public ResponseEntity<MakzanSubmissionReport> getMakzanSubmissionReportById(@PathVariable Integer id) {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

                return makzanSubmissionReportService.getMakzanSubmissionReportById(id)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public MakzanSubmissionReport createMakzanSubmissionReport(

                        @RequestPart("submissionReport") String submissionReportJson,

                        @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL

        ) throws IOException {

                managementSecurity.validateManagementAccess(
                                MAKHZAN_MANAGEMENT_ID);

                ObjectMapper mapper = new ObjectMapper();

                mapper.registerModule(
                                new JavaTimeModule());

                MakzanSubmissionReport report = mapper.readValue(
                                submissionReportJson,
                                MakzanSubmissionReport.class);
                Management management = new Management();
                management.setManagementId(MAKHZAN_MANAGEMENT_ID);
                report.setManagement(management);
                return makzanSubmissionReportService
                                .createMakzanSubmissionReport(
                                                report,
                                                fileURL);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> updateMakzanSubmissionReport(

                        @PathVariable Integer id,

                        @RequestPart("submissionReport") String submissionReportJson,

                        @RequestPart(value = "fileURL", required = false) MultipartFile[] fileURL

        ) {

                managementSecurity.validateManagementAccess(
                                MAKHZAN_MANAGEMENT_ID);

                try {

                        ObjectMapper mapper = new ObjectMapper();

                        mapper.registerModule(
                                        new JavaTimeModule());

                        MakzanSubmissionReport report = mapper.readValue(
                                        submissionReportJson,
                                        MakzanSubmissionReport.class);

                        makzanSubmissionReportService
                                        .updateMakzanSubmissionReport(
                                                        id,
                                                        report,
                                                        fileURL);

                        return ResponseEntity.ok("Updated successfully");

                } catch (Exception e) {

                        return ResponseEntity
                                        .status(
                                                        HttpStatus.INTERNAL_SERVER_ERROR)
                                        .build();
                }

        }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteMakzanSubmissionReport(@PathVariable Integer id) {
                managementSecurity.validateManagementAccess(MAKHZAN_MANAGEMENT_ID);

                try {
                        makzanSubmissionReportService.deleteMakzanSubmissionReport(id);
                        return ResponseEntity.ok()
                                        .body("AnnualReport with ID " + id + " has been successfully deleted.");
                } catch (RuntimeException e) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body("AnnualReport with ID " + id + " not found.");
                }
        }

        // @GetMapping("/search")
        // public List<MakzanSubmissionReport> searchAnnualReport(
        // @RequestParam(required = false) String keyword,
        // @RequestParam(required = false) String field) {
        // return makzanSubmissionReportService.searchByKeyword(field, keyword);
        // }
}
