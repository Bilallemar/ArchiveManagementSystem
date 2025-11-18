package com.MCIT.ArchiveManagementSystem.controller;

import com.MCIT.ArchiveManagementSystem.models.Org;
import com.MCIT.ArchiveManagementSystem.services.OrgService;


import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/org")

public class OrgController {

    private final OrgService orgService;
      public OrgController( OrgService orgService) {
        this.orgService = orgService;
    }

    @PostMapping
    public Org create(@RequestBody Org org) {
        return orgService.createOrg(org);
    }

    @PutMapping("/{id}")
    public Org update(@PathVariable Integer id, @RequestBody Org org) {
        return orgService.updateOrg(id, org);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        orgService.deleteOrg(id);
    }

    @GetMapping
    public List<Org> getAll() {
        return orgService.getAllOrgs();
    }

    @GetMapping("/{id}")
    public Org getById(@PathVariable Integer id) {
        return orgService.getOrgById(id);
    }
}
