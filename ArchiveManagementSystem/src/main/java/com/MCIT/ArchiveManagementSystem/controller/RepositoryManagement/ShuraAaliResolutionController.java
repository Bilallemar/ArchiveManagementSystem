package com.MCIT.ArchiveManagementSystem.controller.RepositoryManagement;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ShuraAaliResolution;
import com.MCIT.ArchiveManagementSystem.security.ManagementSecurityService;
import com.MCIT.ArchiveManagementSystem.services.RepositoryManagement.ShuraAaliResolutionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public List<ShuraAaliResolution> getAll() {
        managementSecurity.validateManagementAccess(HIFZIYA_MANAGEMENT_ID);
        return service.getAll();
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
