package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakhzanWaradaSadera;

public interface MakhzanWaradaSaderaRepository extends JpaRepository<MakhzanWaradaSadera, Integer> {
     List<MakhzanWaradaSadera> findByManagement(Management management);
    Long countByManagement(Management management);



    
}
