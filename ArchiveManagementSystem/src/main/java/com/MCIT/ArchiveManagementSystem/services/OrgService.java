package com.MCIT.ArchiveManagementSystem.services;

import com.MCIT.ArchiveManagementSystem.models.Org;
import com.MCIT.ArchiveManagementSystem.repositories.OrgRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrgService {

    private final OrgRepository orgRepository;

    public OrgService(OrgRepository orgRepository) {
        this.orgRepository = orgRepository;
    }

    public List<Org> getAllOrgs() {
        return orgRepository.findAll();
    }

    public Org getOrgById(Integer id) {
        return orgRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Org not found with id: " + id));
    }

    public Org createOrg(Org org) {
        return orgRepository.save(org);
    }

    public Org updateOrg(Integer id, Org orgDetails) {
        Org existing = orgRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Org not found with id: " + id));

        existing.setName(orgDetails.getName());
        existing.setDepartment(orgDetails.getDepartment());

        return orgRepository.save(existing);
    }

    public void deleteOrg(Integer id) {
        Org existing = orgRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Org not found with id: " + id));
        orgRepository.delete(existing);
    }
}
