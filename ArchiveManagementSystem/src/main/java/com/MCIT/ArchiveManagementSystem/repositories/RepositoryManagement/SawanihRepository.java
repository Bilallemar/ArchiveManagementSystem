package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.Management;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;

public interface SawanihRepository  extends JpaRepository<Sawanih, Integer> {
 List<Sawanih> findByManagement(Management management);
    Long countByManagement(Management management);
    // List<Sawanih> findByBookNumberContainingIgnoreCaseOrLetterNumberContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
    //     String bookNumber, String letterNumber, String recipient, String sender
    // );

    // // 🔹 د هر فیلډ لپاره جلا methods (د فلټر لپاره)
    // List<Sawanih> findByBookNumberContainingIgnoreCase(String bookNumber);
    // List<Sawanih> findByLetterNumberContainingIgnoreCase(String letterNumber);
    // List<Sawanih> findByRecipientContainingIgnoreCase(String recipient);
    // List<Sawanih> findBySenderContainingIgnoreCase(String sender);
    
}
