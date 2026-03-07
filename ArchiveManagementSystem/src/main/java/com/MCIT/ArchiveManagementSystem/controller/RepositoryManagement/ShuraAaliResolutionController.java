package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;

import org.springframework.data.domain.Page;
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

import com.MCIT.ArchiveManagementSystem.dtos.ShuraAaliResolutionDTO;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ShuraAaliResolution;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.ShuraAaliResolutionService;

@RestController
@RequestMapping("/api/shura-aali-resolutions")
public class ShuraAaliResolutionController {

    private final ShuraAaliResolutionService service;
    private final ManagementSecurityService managementSecurity;

    private static final Long HIFZIYA_MANAGEMENT_ID = 2L;

    public ShuraAaliResolutionController(
            ShuraAaliResolutionService service,
            ManagementSecurityService managementSecurity) {
        this.service = service;
        this.managementSecurity = managementSecurity;
    }

    @GetMapping
    public ResponseEntity<Page<ShuraAaliResolutionDTO>> getAll(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String direction,
            @RequestParam(defaultValue = "title") String field,
            @RequestParam(defaultValue = "") String term) {

        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);

        // Build Management object from the constant ID
        Management management = new Management();
        management.setManagementId(HIFZIYA_MANAGEMENT_ID);

        Page<ShuraAaliResolutionDTO> result = service.getAll(
                management, direction, field, term, page, size);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShuraAaliResolution> getById(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ShuraAaliResolution create(@RequestBody ShuraAaliResolution resolution) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        Management management = new Management();
        management.setManagementId(HIFZIYA_MANAGEMENT_ID);
        resolution.setManagement(management);
        return service.create(resolution);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShuraAaliResolution> update(
            @PathVariable Integer id,
            @RequestBody ShuraAaliResolution resolution) {

        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        return ResponseEntity.ok(service.update(id, resolution));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        service.delete(id);
        return ResponseEntity.ok("Record deleted successfully");
    }
}
