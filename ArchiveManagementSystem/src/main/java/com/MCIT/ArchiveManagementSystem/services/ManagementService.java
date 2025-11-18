package com.MCIT.ArchiveManagementSystem.services;

import com.MCIT.ArchiveManagementSystem.models.Management;
import java.util.List;

public interface ManagementService {
    Management createManagement(Management management);
    List<Management> getAllManagements();
    Management getManagementById(Long id);
    void deleteManagement(Long id);
}
